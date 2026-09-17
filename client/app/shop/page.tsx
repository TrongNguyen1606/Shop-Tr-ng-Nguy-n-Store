'use client';
import { useEffect, useState } from 'react';
import ProductCard from '@/components/shop/ProductCard';
import OrderModal from '@/components/shop/OrderModal';
import TopDeposit from '@/components/leaderboard/TopDeposit';
import { api } from '@/lib/api';

const CATEGORIES = [
  { key: '', label: 'Tất cả' },
  { key: 'gamepass', label: 'Gamepass' },
  { key: 'currency', label: 'Tiền tệ' },
  { key: 'boost', label: 'Boost' },
];

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [category, setCategory] = useState('');
  const [selected, setSelected] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/products${category ? `?category=${category}` : ''}`)
      .then(setProducts)
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              onClick={() => setCategory(c.key)}
              className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                category === c.key ? 'bg-fuchsia-600 text-white' : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-neutral-400">Đang tải sản phẩm...</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} onBuy={setSelected} />
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <TopDeposit />
      </div>

      {selected && <OrderModal product={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
