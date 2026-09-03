const fs = require("fs");
const { execFileSync } = require("child_process");

const catalogPath = "data/member-products.json";
const manifestPath = "data/amazon-link-manifest.csv";
const resultsPath = "data/amazon-scrape-results.json";

const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36";

const categoryQueries = {
  mobile: [
    "power bank",
    "wireless earbuds",
    "fast charger",
    "phone case",
    "mobile accessories",
    "car phone holder"
  ],
  fashion: [
    "abaya",
    "hijab",
    "modest dress",
    "kaftan",
    "thobe",
    "women modest wear"
  ],
  jewelry: [
    "watches",
    "jewelry set",
    "bracelet",
    "necklace",
    "ring set",
    "watch box"
  ],
  home: [
    "kitchen organizer",
    "air fryer",
    "cookware set",
    "home organizer",
    "coffee maker",
    "storage containers"
  ],
  furniture: [
    "home decor",
    "floor lamp",
    "shoe rack",
    "storage cabinet",
    "side table",
    "wall shelves"
  ],
  auto: [
    "car accessories",
    "car vacuum",
    "dash camera",
    "car charger",
    "car phone holder",
    "seat cover"
  ],
  baby: [
    "baby stroller",
    "diaper bag",
    "baby bottle",
    "baby monitor",
    "baby carrier",
    "baby care"
  ],
  health: [
    "massage gun",
    "blood pressure monitor",
    "fitness tracker",
    "electric toothbrush",
    "hair dryer",
    "personal care"
  ],
  sports: [
    "fitness equipment",
    "resistance bands",
    "water bottle",
    "camping gear",
    "yoga mat",
    "sports outdoor"
  ],
  creator: [
    "ring light",
    "wireless microphone",
    "tripod",
    "phone gimbal",
    "studio light",
    "content creator kit"
  ],
  travel: [
    "luggage",
    "travel backpack",
    "travel organizer",
    "duffle bag",
    "packing cubes",
    "travel pillow"
  ],
  gaming: [
    "gaming headset",
    "gaming keyboard",
    "gaming mouse",
    "gaming controller",
    "gaming chair",
    "gaming accessories"
  ]
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function csvCell(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

function amazonUrl(language, asin) {
  return `https://www.amazon.ae/-/${language}/dp/${asin}`;
}

function fetchHtml(query, page) {
  const url = `https://www.amazon.ae/-/en/s?k=${encodeURIComponent(query)}&s=popularity-rank&page=${page}`;
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
  ], { encoding: "utf8", maxBuffer: 8 * 1024 * 1024 });
}

function extractAsins(html) {
  const found = [];
  const seen = new Set();

  for (const match of html.matchAll(/data-asin="([A-Z0-9]{10})"/g)) {
    const asin = match[1];
    if (asin && !seen.has(asin)) {
      seen.add(asin);
      found.push(asin);
    }
  }

  for (const match of html.matchAll(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})/g)) {
    const asin = match[1];
    if (asin && !seen.has(asin)) {
      seen.add(asin);
      found.push(asin);
    }
  }

  return found;
}

(async () => {
  const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
  const products = Array.isArray(catalog.products) ? catalog.products : catalog;
  const collected = {};
  const seenGlobal = new Set();

  for (const [category, queries] of Object.entries(categoryQueries)) {
    const categoryAsins = [];
    const seenCategory = new Set();

    for (const query of queries) {
      if (categoryAsins.length >= 50) break;

      for (let page = 1; page <= 3; page += 1) {
        if (categoryAsins.length >= 50) break;

        try {
          const html = fetchHtml(query, page);
          if (/Robot Check|Enter the characters|captcha/i.test(html)) {
            console.log(`${category} / ${query} / page ${page}: captcha`);
            continue;
          }

          const asins = extractAsins(html)
            .filter((asin) => !seenCategory.has(asin) && !seenGlobal.has(asin));

          for (const asin of asins) {
            seenCategory.add(asin);
            seenGlobal.add(asin);
            categoryAsins.push({ asin, query, page });
            if (categoryAsins.length >= 50) break;
          }

          console.log(`${category} / ${query} / page ${page}: +${asins.length}, total ${categoryAsins.length}`);
        } catch (error) {
          console.log(`${category} / ${query} / page ${page}: ${error.message}`);
        }

        await sleep(650);
      }
    }

    collected[category] = categoryAsins.slice(0, 50);
  }

  const missing = [];
  for (const [category, asins] of Object.entries(collected)) {
    const categoryProducts = products.filter((product) => product.category === category);
    categoryProducts.forEach((product, index) => {
      const item = asins[index];
      if (!item) {
        missing.push(product.id);
        product.marketplace = { en: "", ar: "" };
        product.amazon = { asin: "", en: "", ar: "" };
        return;
      }

      product.marketplace = {
        en: amazonUrl("en", item.asin),
        ar: amazonUrl("ar", item.asin)
      };
      product.amazon = {
        asin: item.asin,
        en: amazonUrl("en", item.asin),
        ar: amazonUrl("ar", item.asin),
        query: item.query
      };
    });
  }

  fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2), "utf8");
  fs.writeFileSync(resultsPath, JSON.stringify({ collected, missing }, null, 2), "utf8");

  const rows = [
    [
      "id",
      "category",
      "title_en",
      "title_ar",
      "amazon_asin",
      "amazon_english_url",
      "amazon_arabic_url",
      "source_platform",
      "status",
      "collection_note"
    ].join(","),
    ...products.map((product) => [
      product.id,
      product.category,
      product.title?.en || "",
      product.title?.ar || "",
      product.amazon?.asin || "",
      product.amazon?.en || "",
      product.amazon?.ar || "",
      "amazon.ae",
      product.amazon?.asin ? "ready" : "pending",
      product.amazon?.asin ? `Amazon.ae popularity-rank query: ${product.amazon.query || ""}` : "Needs Amazon.ae product link"
    ].map(csvCell).join(","))
  ];

  fs.writeFileSync(manifestPath, rows.join("\n"), "utf8");

  const ready = products.filter((product) => product.amazon?.en && product.amazon?.ar).length;
  const categoryCounts = Object.fromEntries(Object.entries(collected).map(([category, items]) => [category, items.length]));
  console.log(JSON.stringify({ products: products.length, ready, missing: missing.length, categoryCounts }, null, 2));
  process.exit(missing.length ? 1 : 0);
})();
