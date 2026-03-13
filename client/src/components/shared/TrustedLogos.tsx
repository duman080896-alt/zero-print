const clients = [
  "Coca Cola", "Sprite", "Makita", "DNS", "DKS",
  "Донер на Абая", "Салам бро", "Coffee Original",
  "DIA Construction", "BI Group", "LUK OIL", "NCOC",
  "Mycar", "Aksa", "Прима дистрибьюшн", "Canon",
  "Euro Super Plast", "Colgate", "Magnum GO",
  "Партия Аманат", "Алматы Жылу жүйесі", "AL Style",
];

export default function TrustedLogos() {
  return (
    <section className="py-12 bg-gray-50 border-y border-gray-100" data-testid="trusted-logos">
      <div className="container mx-auto px-4">
        <p className="text-center text-sm font-semibold text-gray-400 uppercase tracking-widest mb-8">
          Нам доверяют
        </p>
        <div className="relative overflow-hidden">
          <div className="flex animate-scroll gap-8 w-max">
            {[...clients, ...clients].map((name, i) => (
              <div
                key={i}
                className="flex-shrink-0 h-12 px-6 flex items-center justify-center rounded-lg bg-white border border-gray-100 shadow-sm"
                data-testid={`logo-${i}`}
              >
                <span className="text-sm font-semibold text-gray-400 whitespace-nowrap select-none">
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
