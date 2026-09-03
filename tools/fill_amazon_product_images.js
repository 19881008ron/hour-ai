const fs = require("fs");
const { execFileSync } = require("child_process");

const catalogPath = "data/member-products.json";
const manifestPath = "data/amazon-image-manifest.csv";
const resultsPath = "data/amazon-image-results.json";
const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36";

function csvCell(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function fetchHtml(url) {
  return execFileSync("curl.exe", [
    "-L",
    "--compressed",
    "--connect-timeout",
    "10",
    "--max-time",
    "35",
    "-A",
    userAgent,
    "-H",
    "Accept-Language: en-AE,en;q=0.9",
    url
  ], { encoding: "utf8", maxBuffer: 10 * 1024 * 1024 });
}

function cleanHtml(value) {
  return String(value || "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#34;/g, '"')
    .replace(/\\u002F/g, "/");
}

function scoreImageUrl(url) {
  const values = [...String(url).matchAll(/(?:UL|SX|SY|SL|AC)_?(\d{2,4})/g)].map((match) => Number(match[1]));
  return values.length ? Math.max(...values) : 0;
}

function bestFromSrcset(srcset) {
  const entries = cleanHtml(srcset)
    .split(",")
    .map((part) => part.trim().split(/\s+/)[0])
    .filter(Boolean);
  return entries.sort((a, b) => scoreImageUrl(b) - scoreImageUrl(a))[0] || "";
}

function normalizeImageUrl(url) {
  const value = cleanHtml(url).trim();
  if (!value || !/^https:\/\/m\.media-amazon\.com\/images\//i.test(value)) return "";
  return value;
}

function extractSearchImages(html) {
  const imagesByAsin = new Map();
  const resultBlockRegex = /<div[^>]+data-asin="([A-Z0-9]{10})"[^>]+data-component-type="s-search-result"[\s\S]*?(?=<div[^>]+data-asin="[A-Z0-9]{10}"[^>]+data-component-type="s-search-result"|<\/body>)/g;

  for (const blockMatch of html.matchAll(resultBlockRegex)) {
    const asin = blockMatch[1];
    const block = blockMatch[0];
    const imgMatch = block.match(/<img[^>]+class="[^"]*\bs-image\b[^"]*"[^>]*>/);
    if (!imgMatch) continue;

    const tag = imgMatch[0];
    const srcset = tag.match(/\ssrcset="([^"]+)"/)?.[1] || "";
    const src = tag.match(/\ssrc="([^"]+)"/)?.[1] || "";
    const alt = cleanHtml(tag.match(/\salt="([^"]*)"/)?.[1] || "");
    const image = normalizeImageUrl(bestFromSrcset(srcset) || src);
    if (image) imagesByAsin.set(asin, { image, alt, source: "search" });
  }

  return imagesByAsin;
}

function extractDetailImage(html) {
  const cleaned = cleanHtml(html);
  const candidates = [];

  for (const pattern of [
    /"landingImageUrl"\s*:\s*"([^"]+)"/g,
    /"large"\s*:\s*"([^"]+)"/g,
    /"hiRes"\s*:\s*"([^"]+)"/g,
    /data-old-hires="([^"]+)"/g,
    /id="landingImage"[^>]+src="([^"]+)"/g
  ]) {
    for (const match of cleaned.matchAll(pattern)) {
      const image = normalizeImageUrl(match[1]);
      if (image) candidates.push(image);
    }
  }

  return [...new Set(candidates)].sort((a, b) => scoreImageUrl(b) - scoreImageUrl(a))[0] || "";
}

function searchUrl(query, page) {
  return `https://www.amazon.ae/-/en/s?k=${encodeURIComponent(query)}&s=popularity-rank&page=${page}`;
}

function detailUrl(asin) {
  return `https://www.amazon.ae/-/en/dp/${asin}`;
}

(async () => {
  const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
  const products = Array.isArray(catalog.products) ? catalog.products : catalog;
  const productsByQuery = new Map();
  const imageRecords = new Map();

  for (const product of products) {
    const query = product.amazon?.query;
    if (!query || !product.amazon?.asin) continue;
    if (!productsByQuery.has(query)) productsByQuery.set(query, []);
    productsByQuery.get(query).push(product);
  }

  for (const [query, queryProducts] of productsByQuery.entries()) {
    const wanted = new Set(queryProducts.map((product) => product.amazon.asin));
    for (let page = 1; page <= 3; page += 1) {
      const missingBefore = [...wanted].filter((asin) => !imageRecords.has(asin)).length;
      if (!missingBefore) break;

      try {
        const html = fetchHtml(searchUrl(query, page));
        const found = extractSearchImages(html);
        let added = 0;
        for (const asin of wanted) {
          const record = found.get(asin);
          if (record && !imageRecords.has(asin)) {
            imageRecords.set(asin, record);
            added += 1;
          }
        }
        console.log(`${query} / page ${page}: +${added}, missing ${[...wanted].filter((asin) => !imageRecords.has(asin)).length}`);
      } catch (error) {
        console.log(`${query} / page ${page}: ${error.message}`);
      }

      await sleep(500);
    }
  }

  const missingAfterSearch = products.filter((product) => product.amazon?.asin && !imageRecords.has(product.amazon.asin));
  console.log(`detail fallback needed: ${missingAfterSearch.length}`);

  for (const product of missingAfterSearch) {
    const asin = product.amazon.asin;
    try {
      const html = fetchHtml(detailUrl(asin));
      const image = extractDetailImage(html);
      if (image) {
        imageRecords.set(asin, { image, alt: product.title?.en || asin, source: "detail" });
      }
      console.log(`${asin}: ${image ? "detail image found" : "no detail image"}`);
    } catch (error) {
      console.log(`${asin}: ${error.message}`);
    }
    await sleep(450);
  }

  const rows = [
    [
      "id",
      "category",
      "title_en",
      "amazon_asin",
      "image_url",
      "image_source",
      "status",
      "alt_text"
    ].join(",")
  ];

  let ready = 0;
  for (const product of products) {
    const asin = product.amazon?.asin || "";
    const record = imageRecords.get(asin);
    if (record?.image) {
      product.images = [
        record.image,
        ...(Array.isArray(product.images) ? product.images.filter((url) => !String(url).includes("unsplash.com")).slice(0, 2) : [])
      ];
      ready += 1;
    }

    rows.push([
      product.id,
      product.category,
      product.title?.en || "",
      asin,
      record?.image || "",
      record?.source || "",
      record?.image ? "ready" : "missing",
      record?.alt || ""
    ].map(csvCell).join(","));
  }

  fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2), "utf8");
  fs.writeFileSync(manifestPath, rows.join("\n"), "utf8");
  fs.writeFileSync(resultsPath, JSON.stringify({
    products: products.length,
    ready,
    missing: products.length - ready,
    missingProducts: products
      .filter((product) => !imageRecords.has(product.amazon?.asin))
      .map((product) => ({ id: product.id, category: product.category, asin: product.amazon?.asin, title: product.title?.en }))
  }, null, 2), "utf8");

  console.log(JSON.stringify({ products: products.length, ready, missing: products.length - ready }, null, 2));
  process.exit(ready === products.length ? 0 : 1);
})();
