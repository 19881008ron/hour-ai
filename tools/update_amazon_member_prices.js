const fs = require("fs");
const { execFileSync } = require("child_process");

const catalogPath = "data/member-products.json";
const manifestPath = "data/amazon-price-manifest.csv";
const resultsPath = "data/amazon-price-results.json";
const AED_PER_USD = 3.6725;
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
  ], { encoding: "utf8", maxBuffer: 12 * 1024 * 1024 });
}

function cleanHtml(value) {
  return String(value || "")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&#160;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#34;/g, '"')
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseAedPrice(text) {
  const cleaned = cleanHtml(text);
  if (!cleaned) return null;
  if (!/(AED|د\.إ|درهم|Dhs|مبلغ)/i.test(cleaned)) return null;
  const match = cleaned.replace(/,/g, "").match(/(\d+(?:\.\d{1,2})?)/);
  if (!match) return null;
  const value = Number(match[1]);
  return Number.isFinite(value) && value > 0 ? value : null;
}

function extractFirstPrice(html) {
  const candidates = [];
  const cleaned = String(html || "");

  for (const match of cleaned.matchAll(/<span[^>]*class="[^"]*a-offscreen[^"]*"[^>]*>([\s\S]*?)<\/span>/gi)) {
    const price = parseAedPrice(match[1]);
    if (price) candidates.push(price);
  }

  for (const match of cleaned.matchAll(/"priceAmount"\s*:\s*([0-9]+(?:\.[0-9]+)?)/gi)) {
    const price = Number(match[1]);
    if (Number.isFinite(price) && price > 0) candidates.push(price);
  }

  return candidates.find((price) => price > 1) || null;
}

function extractSearchPrices(html) {
  const pricesByAsin = new Map();
  const resultBlockRegex = /<div[^>]+data-asin="([A-Z0-9]{10})"[^>]+data-component-type="s-search-result"[\s\S]*?(?=<div[^>]+data-asin="[A-Z0-9]{10}"[^>]+data-component-type="s-search-result"|<\/body>)/g;

  for (const blockMatch of html.matchAll(resultBlockRegex)) {
    const asin = blockMatch[1];
    const price = extractFirstPrice(blockMatch[0]);
    if (price) pricesByAsin.set(asin, price);
  }

  return pricesByAsin;
}

function searchUrl(query, page) {
  return `https://www.amazon.ae/-/en/s?k=${encodeURIComponent(query)}&s=popularity-rank&page=${page}`;
}

function detailUrl(asin) {
  return `https://www.amazon.ae/-/en/dp/${asin}`;
}

function roundDollar(value) {
  return Math.max(1, Math.round(value));
}

function memberPricesFromAed(aed) {
  const usd = aed / AED_PER_USD;
  return {
    amazonUsd: roundDollar(usd),
    A: roundDollar(usd / 5),
    B: roundDollar(usd / 4),
    C: roundDollar(usd / 3),
  };
}

(async () => {
  const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
  const products = Array.isArray(catalog.products) ? catalog.products : catalog;
  const productsByQuery = new Map();
  const pricesByAsin = new Map();

  for (const product of products) {
    const query = product.amazon?.query;
    const asin = product.amazon?.asin;
    if (!query || !asin) continue;
    if (!productsByQuery.has(query)) productsByQuery.set(query, []);
    productsByQuery.get(query).push(product);
  }

  for (const [query, queryProducts] of productsByQuery.entries()) {
    const wanted = new Set(queryProducts.map((product) => product.amazon.asin));
    for (let page = 1; page <= 3; page += 1) {
      const missing = [...wanted].filter((asin) => !pricesByAsin.has(asin));
      if (!missing.length) break;
      try {
        const found = extractSearchPrices(fetchHtml(searchUrl(query, page)));
        let added = 0;
        for (const asin of missing) {
          if (found.has(asin)) {
            pricesByAsin.set(asin, { aed: found.get(asin), source: "search" });
            added += 1;
          }
        }
        console.log(`${query} / page ${page}: +${added}, missing ${[...wanted].filter((asin) => !pricesByAsin.has(asin)).length}`);
      } catch (error) {
        console.log(`${query} / page ${page}: ${error.message}`);
      }
      await sleep(350);
    }
  }

  const missingAfterSearch = products.filter((product) => product.amazon?.asin && !pricesByAsin.has(product.amazon.asin));
  console.log(`detail fallback needed: ${missingAfterSearch.length}`);
  for (const product of missingAfterSearch) {
    const asin = product.amazon.asin;
    try {
      const price = extractFirstPrice(fetchHtml(detailUrl(asin)));
      if (price) pricesByAsin.set(asin, { aed: price, source: "detail" });
      console.log(`${asin}: ${price ? `AED ${price}` : "no price"}`);
    } catch (error) {
      console.log(`${asin}: ${error.message}`);
    }
    await sleep(300);
  }

  const rows = [[
    "id",
    "category",
    "title_en",
    "amazon_asin",
    "amazon_aed",
    "amazon_usd",
    "c_supply_usd",
    "b_supply_usd",
    "a_supply_usd",
    "source",
    "status"
  ].join(",")];

  let ready = 0;
  for (const product of products) {
    const asin = product.amazon?.asin || "";
    const record = pricesByAsin.get(asin);
    if (record?.aed) {
      const computed = memberPricesFromAed(record.aed);
      product.retail = `$${computed.amazonUsd}`;
      product.amazonPrice = {
        aed: Number(record.aed.toFixed(2)),
        usd: computed.amazonUsd,
        source: record.source,
        rate: AED_PER_USD
      };
      product.prices = {
        C: `$${computed.C}`,
        B: `$${computed.B}`,
        A: `$${computed.A}`
      };
      ready += 1;
    }
    rows.push([
      product.id,
      product.category,
      product.title?.en || "",
      asin,
      record?.aed ? record.aed.toFixed(2) : "",
      record?.aed ? memberPricesFromAed(record.aed).amazonUsd : "",
      record?.aed ? memberPricesFromAed(record.aed).C : "",
      record?.aed ? memberPricesFromAed(record.aed).B : "",
      record?.aed ? memberPricesFromAed(record.aed).A : "",
      record?.source || "",
      record?.aed ? "ready" : "missing"
    ].map(csvCell).join(","));
  }

  fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2), "utf8");
  fs.writeFileSync(manifestPath, rows.join("\n"), "utf8");
  fs.writeFileSync(resultsPath, JSON.stringify({
    products: products.length,
    ready,
    missing: products.length - ready,
    rate: AED_PER_USD,
    missingProducts: products
      .filter((product) => !pricesByAsin.has(product.amazon?.asin))
      .map((product) => ({ id: product.id, category: product.category, asin: product.amazon?.asin, title: product.title?.en }))
  }, null, 2), "utf8");

  console.log(JSON.stringify({ products: products.length, ready, missing: products.length - ready }, null, 2));
  process.exit(ready === products.length ? 0 : 1);
})();
