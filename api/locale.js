const countryLanguageMap = {
  CN: "zh",
  HK: "zh",
  MO: "zh",
  TW: "zh",
  SA: "ar",
  AE: "ar",
  QA: "ar",
  KW: "ar",
  BH: "ar",
  OM: "ar",
  JO: "ar",
  EG: "ar",
  MA: "ar"
};

export default function handler(request, response) {
  const country = String(request.headers["x-vercel-ip-country"] || "").toUpperCase();
  response.status(200).json({
    country,
    language: countryLanguageMap[country] || "en"
  });
}
