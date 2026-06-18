const countryLanguageMap = {
  ID: "id",
  SA: "ar",
  AE: "ar",
  QA: "ar",
  KW: "ar",
  BH: "ar",
  OM: "ar",
  JO: "ar",
  EG: "ar",
  MA: "ar",
  ES: "es",
  MX: "es",
  CO: "es",
  AR: "es",
  PE: "es",
  CL: "es",
  FR: "fr",
  BE: "fr",
  CH: "fr",
  CA: "fr",
  JP: "ja"
};

export default function handler(request, response) {
  const country = String(request.headers["x-vercel-ip-country"] || "").toUpperCase();
  response.status(200).json({
    country,
    language: countryLanguageMap[country] || "en"
  });
}
