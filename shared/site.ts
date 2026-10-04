// Единый источник фактов о компании для текстов, мета-тегов и разметки.
// Меняйте цифры только здесь — раньше они расходились от страницы к странице.

export const SITE_URL = "https://zeroprint.kz";
export const BUSINESS_ID = `${SITE_URL}/#business`;

export const COMPANY = {
  name: "ZERO PRINT",
  yearsLabel: "5+ лет",
  clientsLabel: "500+",
  minRun: 10,
  wholesaleRun: 50,
  responseMinutes: 3,
  email: "zeroprint.kz@gmail.com",
  address: {
    streetAddress: "ул. Радостовца 152/6, офис 104",
    addressLocality: "Алматы",
    addressRegion: "Алматы",
    postalCode: "050059",
    addressCountry: "KZ",
  },
  geo: { latitude: 43.22884, longitude: 76.89417 },
  phones: {
    main: { tel: "+77716246461", display: "+7 771 624 64 61" },
    sales: { tel: "+77001584039", display: "+7 700 158 40 39" },
  },
  whatsapp: "77716246461",
  hours: {
    weekdays: "Пн-Пт: 9:00 — 18:00",
    saturday: "Сб: 10:00 — 15:00",
    sunday: "Вс: выходной",
  },
} as const;

export const MIN_RUN_LABEL = `от ${COMPANY.minRun} шт`;
export const WHOLESALE_RUN_LABEL = `от ${COMPANY.wholesaleRun} шт`;
export const RESPONSE_LABEL = `${COMPANY.responseMinutes} минуты`;
