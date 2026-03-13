import { useCart } from '@/hooks/useCart';
import { useState } from 'react';
import { Link } from 'wouter';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { proxyImage } from '@/lib/utils';
import { useSEO } from '@/hooks/useSEO';
import { Trash2, Minus, Plus, ShoppingCart } from 'lucide-react';

function formatPrice(price: number): string {
  return price.toLocaleString('ru-RU') + ' ₸';
}

export default function Cart() {
  const { items, removeItem, updateQty, clearCart, totalPrice, totalQty } = useCart();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [comment, setComment] = useState('');
  const [branding, setBranding] = useState('Нужно');

  useSEO('Корзина заказов | ZERO PRINT', 'Корзина заказов ZERO PRINT — добавьте товары и отправьте заявку одним сообщением в WhatsApp.');

  const sendToWhatsApp = () => {
    if (!phone) {
      document.getElementById('phoneInput')?.focus();
      return;
    }
    const list = items.map((item, i) =>
      `${i + 1}. ${item.name}${item.article ? ' (арт. ' + item.article + ')' : ''} — ${item.qty} шт. × ${formatPrice(item.price)}`
    ).join('\n');

    const text = `Здравствуйте! Хочу оформить заказ.

📋 ТОВАРЫ:
${list}

💰 Сумма: ~${formatPrice(totalPrice)}
🖨️ Нанесение: ${branding}
${company ? '🏢 Компания: ' + company : ''}
👤 Имя: ${name || '—'}
📞 Телефон: ${phone}
${comment ? '💬 ' + comment : ''}`;

    window.open('https://wa.me/77716246461?text=' + encodeURIComponent(text), '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      {items.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-gray-400 py-20">
          <ShoppingCart className="w-16 h-16 opacity-30" />
          <h2 className="text-2xl font-bold text-gray-800" data-testid="text-cart-empty">Корзина пуста</h2>
          <p className="text-gray-500">Добавьте товары из каталога</p>
          <Link
            href="/catalog"
            className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-[#E8500A] transition-colors"
            data-testid="link-catalog-from-cart"
          >
            Перейти в каталог →
          </Link>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8 flex-1">
          <h1 className="text-3xl font-black mb-2" data-testid="text-cart-title">Корзина заказов</h1>
          <p className="text-gray-500 mb-8">Добавьте товары и отправьте заявку одним сообщением</p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-3">
              {items.map(item => (
                <div
                  key={item.id}
                  className="bg-white border border-gray-200 rounded-xl p-4 flex gap-4"
                  data-testid={`cart-item-${item.id}`}
                >
                  <img
                    src={proxyImage(item.image)}
                    alt={item.name}
                    className="w-20 h-20 object-contain rounded-lg border border-gray-100 flex-shrink-0 bg-gray-50"
                    onError={(e: any) => { e.target.style.display = 'none'; }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm mb-1 truncate" data-testid={`cart-item-name-${item.id}`}>{item.name}</div>
                    {item.article && (
                      <div className="text-xs text-gray-400 mb-2">арт. {item.article}</div>
                    )}
                    <div className="text-[#E8500A] font-bold text-sm">
                      {formatPrice(item.price)}/шт
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQty(item.id, item.qty - 1)}
                        className="w-8 h-8 bg-gray-50 flex items-center justify-center font-bold hover:bg-[#E8500A] hover:text-white transition-colors"
                        data-testid={`cart-qty-minus-${item.id}`}
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <input
                        type="number"
                        value={item.qty}
                        min={1}
                        onChange={e => updateQty(item.id, +e.target.value)}
                        className="w-12 h-8 text-center font-bold text-sm outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        data-testid={`cart-qty-input-${item.id}`}
                      />
                      <button
                        onClick={() => updateQty(item.id, item.qty + 1)}
                        className="w-8 h-8 bg-gray-50 flex items-center justify-center font-bold hover:bg-[#E8500A] hover:text-white transition-colors"
                        data-testid={`cart-qty-plus-${item.id}`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="font-black text-base" data-testid={`cart-item-total-${item.id}`}>
                      {formatPrice(item.price * item.qty)}
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors"
                      data-testid={`cart-remove-${item.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              <button
                onClick={clearCart}
                className="text-sm text-gray-400 hover:text-red-500 transition-colors mt-2 flex items-center gap-1"
                data-testid="button-clear-cart"
              >
                <Trash2 className="w-3.5 h-3.5" /> Очистить корзину
              </button>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 h-fit sticky top-24">
              <h3 className="text-lg font-black mb-4 pb-4 border-b-2 border-gray-100">Ваша заявка</h3>

              <div className="space-y-2 mb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Позиций:</span>
                  <span className="font-bold" data-testid="text-cart-positions">{items.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Штук:</span>
                  <span className="font-bold" data-testid="text-cart-qty">{totalQty}</span>
                </div>
                <div className="flex justify-between text-lg font-black pt-2 border-t-2 border-gray-100">
                  <span>Сумма (~):</span>
                  <span data-testid="text-cart-total">{formatPrice(totalPrice)}</span>
                </div>
                <div className="text-xs text-gray-400">* Финальная цена после согласования</div>
              </div>

              <div className="mb-4">
                <label className="text-xs font-bold text-gray-600 block mb-2">Нанесение логотипа</label>
                <div className="flex gap-3">
                  {['Нужно', 'Не нужно'].map(v => (
                    <label key={v} className="flex items-center gap-2 cursor-pointer text-sm">
                      <input
                        type="radio"
                        name="branding"
                        value={v}
                        checked={branding === v}
                        onChange={() => setBranding(v)}
                        data-testid={`radio-branding-${v}`}
                      />
                      {v}
                    </label>
                  ))}
                </div>
              </div>

              {[
                { id: 'company', label: 'Компания', val: company, set: setCompany, ph: 'ТОО Ромашка' },
                { id: 'name', label: 'Ваше имя', val: name, set: setName, ph: 'Асет' },
                { id: 'phone', label: 'Телефон *', val: phone, set: setPhone, ph: '+7 777 123 45 67' },
              ].map(f => (
                <div key={f.id} className="mb-3">
                  <label className="text-xs font-bold text-gray-600 block mb-1">{f.label}</label>
                  <input
                    id={f.id + 'Input'}
                    value={f.val}
                    onChange={e => f.set(e.target.value)}
                    placeholder={f.ph}
                    className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg text-sm outline-none focus:border-[#E8500A] transition-colors"
                    data-testid={`input-cart-${f.id}`}
                  />
                </div>
              ))}

              <div className="mb-4">
                <label className="text-xs font-bold text-gray-600 block mb-1">Комментарий</label>
                <textarea
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="Сроки, пожелания..."
                  rows={2}
                  className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg text-sm outline-none resize-none focus:border-[#E8500A] transition-colors"
                  data-testid="input-cart-comment"
                />
              </div>

              <button
                onClick={sendToWhatsApp}
                className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-4 rounded-xl font-black text-base transition-all hover:-translate-y-0.5 hover:shadow-lg flex items-center justify-center gap-2"
                data-testid="button-send-whatsapp"
              >
                📱 Отправить заявку в WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
