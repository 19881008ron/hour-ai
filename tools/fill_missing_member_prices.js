const fs = require("fs");
const path = require("path");

const AED_PER_USD = 3.6725;
const root = path.resolve(__dirname, "..");
const productsPath = path.join(root, "data", "member-products.json");
const manifestPath = path.join(root, "data", "amazon-price-manifest.csv");
const resultsPath = path.join(root, "data", "amazon-price-results.json");

const data = JSON.parse(fs.readFileSync(productsPath, "utf8"));

function median(values) {
  const sorted = values.filter(Number.isFinite).sort((a, b) => a - b);
  if (!sorted.length) return null;
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function money(value) {
  return `$${Math.max(1, Math.round(value))}`;
}

const categoryMedians = new Map();
for (const product of data.products) {
  if (!categoryMedians.has(product.category)) categoryMedians.set(product.category, []);
  const aed = Number(product.amazonPrice && product.amazonPrice.aed);
  if (Number.isFinite(aed) && aed > 0) categoryMedians.get(product.category).push(aed);
}

const medians = new Map();
for (const [category, values] of categoryMedians) {
  medians.set(category, median(values));
}

const globalMedian = median([...categoryMedians.values()].flat()) || 150;
let filled = 0;

for (const product of data.products) {
  const hasUsd = Number(product.amazonPrice && product.amazonPrice.usd) > 0;
  if (hasUsd) continue;

  const aed = Number((medians.get(product.category) || globalMedian).toFixed(2));
  const usd = Number((aed / AED_PER_USD).toFixed(2));
  product.amazonPrice = {
    aed,
    usd,
    source: "category-median",
    rate: AED_PER_USD,
  };
  product.retail = money(usd);
  product.prices = {
    C: money(usd / 3),
    B: money(usd / 4),
    A: money(usd / 5),
  };
  filled += 1;
}

for (const product of data.products) {
  const usd = Number(product.amazonPrice && product.amazonPrice.usd);
  if (!Number.isFinite(usd) || usd <= 0) {
    throw new Error(`Missing Amazon reference price for ${product.id}`);
  }
  product.retail = money(usd);
  product.prices = {
    C: money(usd / 3),
    B: money(usd / 4),
    A: money(usd / 5),
  };
}

fs.writeFileSync(productsPath, `${JSON.stringify(data, null, 2)}\n`);

const csv = [
  "id,category,title_en,amazon_aed,amazon_usd,source,c_supply,b_supply,a_supply,amazon_en_url,amazon_ar_url",
  ...data.products.map((product) => [
    product.id,
    product.category,
    `"${String(product.title.en).replace(/"/g, '""')}"`,
    product.amazonPrice.aed,
    product.amazonPrice.usd,
    product.amazonPrice.source,
    product.prices.C,
    product.prices.B,
    product.prices.A,
    product.links && product.links.amazonEn ? product.links.amazonEn : "",
    product.links && product.links.amazonAr ? product.links.amazonAr : "",
  ].join(",")),
].join("\n");
fs.writeFileSync(manifestPath, `${csv}\n`);

const results = data.products.map((product) => ({
  id: product.id,
  category: product.category,
  title: product.title.en,
  amazonPrice: product.amazonPrice,
  prices: product.prices,
}));
fs.writeFileSync(resultsPath, `${JSON.stringify(results, null, 2)}\n`);

console.log(JSON.stringify({
  products: data.products.length,
  filled,
  directAmazon: data.products.filter((product) => product.amazonPrice.source !== "category-median").length,
  categoryMedian: data.products.filter((product) => product.amazonPrice.source === "category-median").length,
}, null, 2));
