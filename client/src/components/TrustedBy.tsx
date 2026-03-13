const clients = [
  { name: 'Canon', logo: '/logos/canon.png' },
  { name: 'Coca-Cola', logo: '/logos/coca-cola.png' },
  { name: 'Makita', logo: '/logos/makita.png' },
  { name: 'Лукойл', logo: '/logos/lukoil.png' },
  { name: 'NCOC', logo: '/logos/ncoc.png' },
  { name: 'Sprite', logo: '/logos/sprite.png' },
  { name: 'Magnum GO', logo: '/logos/magnum.jpg' },
  { name: 'DNS', logo: '/logos/dns.png' },
  { name: 'DIA Construction', logo: '/logos/dia.png' },
  { name: 'Алматы Жылу Жүйесі', logo: '/logos/almaty-zhylu.png' },
  { name: 'Salam Bro', logo: '/logos/salam-bro.png' },
  { name: 'Doner Na Abaya', logo: '/logos/doner.jpg' },
  { name: 'AL Style', logo: '/logos/al-style.png' },
  { name: 'Aksa', logo: '/logos/aksa.png' },
];

export default function TrustedBy() {
  return (
    <section className="py-16 bg-white overflow-hidden" data-testid="section-trusted-by">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <p className="text-sm font-bold text-orange-500 uppercase tracking-widest mb-2">
            Нам доверяют
          </p>
          <h2 className="text-3xl font-black text-gray-900">
            Более <span className="text-orange-500">500+</span> компаний
            <br />выбрали ZERO PRINT
          </h2>
        </div>

        <div className="relative mb-4">
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10" />
          <div className="flex gap-6 animate-marquee whitespace-nowrap">
            {[...clients, ...clients].map((c, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-36 h-20 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center p-4 hover:border-orange-200 hover:shadow-md transition-all duration-300 group cursor-default"
              >
                <img
                  src={c.logo}
                  alt={c.name}
                  className="max-h-10 max-w-28 object-contain filter grayscale group-hover:grayscale-0 opacity-60 group-hover:opacity-100 transition-all duration-300"
                  onError={(e: any) => {
                    e.target.style.display = 'none';
                    if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="hidden text-xs font-bold text-gray-400 text-center leading-tight">
                  {c.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10" />
          <div className="flex gap-6 animate-marquee-reverse whitespace-nowrap">
            {[...clients.slice(7), ...clients.slice(0, 7), ...clients.slice(7), ...clients.slice(0, 7)].map((c, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-36 h-20 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center p-4 hover:border-orange-200 hover:shadow-md transition-all duration-300 group cursor-default"
              >
                <img
                  src={c.logo}
                  alt={c.name}
                  className="max-h-10 max-w-28 object-contain filter grayscale group-hover:grayscale-0 opacity-60 group-hover:opacity-100 transition-all duration-300"
                  onError={(e: any) => {
                    e.target.style.display = 'none';
                    if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="hidden text-xs font-bold text-gray-400 text-center leading-tight">
                  {c.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-10 mt-10">
          {[
            { num: '500+', label: 'компаний' },
            { num: '5 лет', label: 'на рынке' },
            { num: '15 000+', label: 'заказов' },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl font-black text-gray-900">{s.num}</div>
              <div className="text-xs text-gray-400 uppercase tracking-wide mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
