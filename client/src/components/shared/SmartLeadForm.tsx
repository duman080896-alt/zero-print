import { useState, useRef } from "react";

const WHATSAPP_URL = "https://wa.me/77716246461";

const quantityOptions = [
  { label: "20–50 шт", value: "20-50" },
  { label: "50–200 шт", value: "50-200" },
  { label: "200–500 шт", value: "200-500" },
  { label: "1 000+ шт", value: "1000+" },
];

interface SmartLeadFormProps {
  productTypes: string[];
  title?: string;
  subtitle?: string;
}

export default function SmartLeadForm({ productTypes, title, subtitle }: SmartLeadFormProps) {
  const [productType, setProductType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [fileName, setFileName] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileName(file ? file.name : "");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parts = [
      "Заявка с сайта ZERO PRINT",
      `Тип продукции: ${productType}`,
      `Количество: ${quantity}`,
      `Имя: ${name}`,
      `Телефон: ${phone}`,
    ];
    if (fileName) parts.push(`Файл/Логотип: ${fileName}`);
    const text = parts.join("%0A");
    window.open(`${WHATSAPP_URL}?text=${text}`, "_blank");
  };

  const inputClass = "w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors text-sm";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

  return (
    <section className="py-16 bg-primary" data-testid="smart-lead-form">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-3">
              {title || "Рассчитать стоимость"}
            </h2>
            {subtitle && (
              <p className="text-gray-300 text-base">{subtitle}</p>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-2xl p-8 space-y-5"
            data-testid="lead-form"
          >
            <div>
              <label className={labelClass}>Тип продукции *</label>
              <select
                value={productType}
                onChange={e => setProductType(e.target.value)}
                required
                className={inputClass}
                data-testid="select-product-type"
              >
                <option value="">Выберите тип продукции</option>
                {productTypes.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Примерное количество *</label>
              <select
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                required
                className={inputClass}
                data-testid="select-quantity"
              >
                <option value="">Выберите количество</option>
                {quantityOptions.map(q => (
                  <option key={q.value} value={q.value}>{q.label}</option>
                ))}
              </select>
              <p className="text-xs text-gray-400 mt-1">Минимальный заказ — 20 штук</p>
            </div>

            <div>
              <label className={labelClass}>Логотип или техзадание</label>
              <div
                className="relative border-2 border-dashed border-gray-200 rounded-lg p-4 text-center cursor-pointer hover:border-accent/50 transition-colors"
                onClick={() => fileRef.current?.click()}
                data-testid="file-upload"
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf,.ai,.cdr,.psd,.png,.jpg,.jpeg,.svg"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {fileName ? (
                  <p className="text-sm text-gray-700">{fileName}</p>
                ) : (
                  <div>
                    <p className="text-sm text-gray-500">Нажмите для загрузки файла</p>
                    <p className="text-xs text-gray-400 mt-1">PDF, AI, CDR, PSD, PNG, JPG, SVG</p>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Имя *</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  placeholder="Ваше имя"
                  className={inputClass}
                  data-testid="input-name"
                />
              </div>
              <div>
                <label className={labelClass}>Телефон *</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  required
                  placeholder="+7 (___) ___-__-__"
                  className={inputClass}
                  data-testid="input-phone"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-lg bg-[#25D366] hover:bg-[#1da851] text-white font-bold text-base transition-colors flex items-center justify-center gap-2"
              data-testid="submit-lead"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.933 11.933 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.319 0-4.476-.717-6.262-1.939l-.438-.304-2.655.89.89-2.655-.304-.438A9.957 9.957 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
              </svg>
              Отправить заявку в WhatsApp
            </button>

            <p className="text-center text-xs text-gray-400">
              Работаем по всему Казахстану · Оплата с НДС · Собственное производство
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
