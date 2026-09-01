const fs = require("fs");

const catalogPath = "data/member-products.json";
const manifestPath = "data/noon-link-manifest.csv";

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (quoted) {
      if (char === '"' && next === '"') {
        cell += '"';
        i += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        cell += char;
      }
      continue;
    }

    if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      row.push(cell);
      cell = "";
    } else if (char === "\n") {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else if (char !== "\r") {
      cell += char;
    }
  }

  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }

  return rows;
}

const manifestText = fs.readFileSync(manifestPath, "utf8");
const rows = parseCsv(manifestText).filter((row) => row.length);
const headers = rows.shift();
const index = Object.fromEntries(headers.map((header, i) => [header, i]));
const linkRows = new Map();

for (const row of rows) {
  const id = row[index.id];
  if (!id) continue;
  linkRows.set(id, {
    en: (row[index.noon_english_url] || "").trim(),
    ar: (row[index.noon_arabic_url] || "").trim()
  });
}

const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
const products = Array.isArray(catalog.products) ? catalog.products : catalog;
let updated = 0;
let ready = 0;

for (const product of products) {
  const links = linkRows.get(product.id);
  if (!links) continue;

  product.noon = {
    en: links.en,
    ar: links.ar
  };

  updated += 1;
  if (links.en && links.ar) ready += 1;
}

fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2), "utf8");
console.log(`synced ${updated} products; ${ready} products have both Noon links`);
