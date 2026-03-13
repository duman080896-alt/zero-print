export interface CatalogCategory {
  id: number;
  slug: string;
  name: string;
  h1?: string;
  children?: CatalogCategory[];
}

export const catalogCategories: CatalogCategory[] = [
  {
    id: 3070, slug: "odezhda", name: "Одежда", h1: "Одежда с нанесением логотипа",
    children: [
      { id: 5369, slug: "futbolki", name: "Футболки", h1: "Футболки с логотипом" },
      { id: 5378, slug: "polo", name: "Поло", h1: "Рубашки поло с логотипом" },
      { id: 3076, slug: "hudi", name: "Худи и свитшоты", h1: "Худи и свитшоты с логотипом" },
      { id: 3975, slug: "kurtki", name: "Куртки и ветровки", h1: "Куртки и ветровки с логотипом" },
      { id: 3074, slug: "kepki", name: "Бейсболки и панамы", h1: "Бейсболки и панамы с логотипом" },
      { id: 3084, slug: "golovnye-ubory", name: "Головные уборы", h1: "Головные уборы с логотипом" },
      { id: 3078, slug: "bryuki", name: "Брюки и шорты", h1: "Брюки и шорты с логотипом" },
      { id: 3077, slug: "zhilety", name: "Жилеты", h1: "Жилеты с логотипом" },
      { id: 4800, slug: "specodezhda", name: "Спецодежда", h1: "Спецодежда с логотипом" },
    ]
  },
  {
    id: 3058, slug: "ruchki", name: "Пишущие инструменты", h1: "Ручки и пишущие инструменты с логотипом",
    children: [
      { id: 3059, slug: "plastikovye-ruchki", name: "Пластиковые ручки", h1: "Пластиковые ручки с логотипом" },
      { id: 3060, slug: "metallicheskie-ruchki", name: "Металлические ручки", h1: "Металлические ручки с логотипом" },
      { id: 3063, slug: "ruchki-stilusy", name: "Ручки-стилусы", h1: "Ручки-стилусы с логотипом" },
      { id: 3061, slug: "nabory-ruchek", name: "Наборы ручек", h1: "Наборы ручек с логотипом" },
      { id: 3069, slug: "karandashi", name: "Карандаши", h1: "Карандаши с логотипом" },
    ]
  },
  {
    id: 2953, slug: "posuda", name: "Кухня и посуда", h1: "Кухня и посуда с логотипом",
    children: [
      { id: 2958, slug: "kruzhki", name: "Кружки и стаканы", h1: "Кружки и стаканы с логотипом" },
      { id: 2954, slug: "termosy", name: "Термокружки и термосы", h1: "Термокружки и термосы с логотипом" },
      { id: 2961, slug: "butylki", name: "Бутылки для воды", h1: "Бутылки для воды с логотипом" },
      { id: 2962, slug: "kontejnery", name: "Контейнеры для еды", h1: "Контейнеры для еды с логотипом" },
    ]
  },
  {
    id: 2931, slug: "sumki", name: "Сумки и рюкзаки", h1: "Сумки и рюкзаки с логотипом",
    children: [
      { id: 2932, slug: "ryukzaki", name: "Рюкзаки", h1: "Рюкзаки с логотипом" },
      { id: 2936, slug: "shopery", name: "Для шопинга", h1: "Сумки для шопинга с логотипом" },
      { id: 2933, slug: "dlya-noutbuka", name: "Для ноутбука", h1: "Сумки для ноутбука с логотипом" },
      { id: 2937, slug: "dlya-sporta", name: "Для спорта", h1: "Спортивные сумки с логотипом" },
    ]
  },
  {
    id: 3089, slug: "zonty", name: "Зонты", h1: "Зонты с логотипом",
    children: [
      { id: 3090, slug: "zonty-trosti", name: "Зонты-трости", h1: "Зонты-трости с логотипом" },
      { id: 3092, slug: "skladnye-zonty", name: "Складные зонты", h1: "Складные зонты с логотипом" },
    ]
  },
  {
    id: 2892, slug: "elektronika", name: "Электроника", h1: "Электроника с логотипом",
    children: [
      { id: 3991, slug: "powerbanki", name: "Power Bank", h1: "Power Bank с логотипом" },
      { id: 2895, slug: "kolonki", name: "Колонки и наушники", h1: "Колонки и наушники с логотипом" },
      { id: 2920, slug: "kompyuternye", name: "Компьютерные аксессуары", h1: "Компьютерные аксессуары с логотипом" },
      { id: 3702, slug: "smart-chasy", name: "Смарт-часы", h1: "Смарт-часы с логотипом" },
      { id: 3986, slug: "zaryadnye", name: "Зарядные устройства", h1: "Зарядные устройства с логотипом" },
    ]
  },
  {
    id: 3021, slug: "ofisnye", name: "Офисные аксессуары", h1: "Офисные аксессуары с логотипом",
    children: [
      { id: 3022, slug: "bloknoty", name: "Блокноты", h1: "Блокноты с логотипом" },
      { id: 3026, slug: "ezhednevniki", name: "Ежедневники", h1: "Ежедневники с логотипом" },
      { id: 3030, slug: "papki", name: "Папки", h1: "Папки с логотипом" },
      { id: 3051, slug: "kanctovary", name: "Канцтовары", h1: "Канцтовары с логотипом" },
    ]
  },
  { id: 3238, slug: "aksessuary", name: "Личные аксессуары", h1: "Личные аксессуары с логотипом" },
  { id: 3275, slug: "delovye-podarki", name: "Деловые подарки", h1: "Деловые подарки с логотипом" },
  { id: 5272, slug: "podarochnye-nabory", name: "Подарочные наборы", h1: "Подарочные наборы с логотипом" },
  { id: 3517, slug: "upakovka", name: "Упаковка", h1: "Упаковка с логотипом" },
  { id: 3257, slug: "avto", name: "Автоаксессуары", h1: "Автоаксессуары с логотипом" },
  { id: 3180, slug: "dlya-doma", name: "Для дома", h1: "Товары для дома с логотипом" },
  { id: 3095, slug: "dlya-otdyha", name: "Для отдыха", h1: "Товары для отдыха с логотипом" },
  { id: 3167, slug: "dlya-sporta", name: "Для спорта", h1: "Спорттовары с логотипом" },
  { id: 4197, slug: "dlya-detej", name: "Для детей", h1: "Детские товары с логотипом" },
  { id: 3543, slug: "sedobnye", name: "Съедобные подарки", h1: "Съедобные подарки" },
];

export function getAllCategoryIds(): number[] {
  const ids: number[] = [];
  catalogCategories.forEach(cat => {
    ids.push(cat.id);
    cat.children?.forEach(ch => ids.push(ch.id));
  });
  return ids;
}

export function findCategoryBySlug(slug: string): CatalogCategory | undefined {
  for (const cat of catalogCategories) {
    if (cat.slug === slug) return cat;
    if (cat.children) {
      for (const ch of cat.children) {
        if (ch.slug === slug) return ch;
      }
    }
  }
  return undefined;
}

export function findCategoryById(id: number): CatalogCategory | undefined {
  for (const cat of catalogCategories) {
    if (cat.id === id) return cat;
    if (cat.children) {
      for (const ch of cat.children) {
        if (ch.id === id) return ch;
      }
    }
  }
  return undefined;
}

export function findParentCategory(childId: number): CatalogCategory | undefined {
  for (const cat of catalogCategories) {
    if (cat.children) {
      for (const ch of cat.children) {
        if (ch.id === childId) return cat;
      }
    }
  }
  return undefined;
}

export const categoryIdToSlug: Record<number, string> = {};
catalogCategories.forEach(cat => {
  categoryIdToSlug[cat.id] = cat.slug;
  cat.children?.forEach(ch => {
    categoryIdToSlug[ch.id] = ch.slug;
  });
});

export const topNavCategories = [
  { slug: "odezhda", name: "Одежда" },
  { slug: "ruchki", name: "Ручки" },
  { slug: "posuda", name: "Термосы" },
  { slug: "sumki", name: "Сумки" },
  { slug: "zonty", name: "Зонты" },
  { slug: "elektronika", name: "Электроника" },
];
