'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface Product {
  _id: string;
  name: string;
  image: string;
  price: number;
  discountPercent: number;
  finalPrice: number;
  category: string;
}

export default function ProductCard({ product, onBuy }: { product: Product; onBuy: (p: Product) => void }) {
  return (
    <motion.div
      whileHover={{ y: -6, boxShadow: '0 0 30px -5px rgba(217,70,239,0.5)' }}
      className="bg-neutral-900/80 border border-fuchsia-500/20 rounded-2xl overflow-hidden cursor-pointer"
      onClick={() => onBuy(product)}
    >
      <div className="relative h-36 bg-neutral-800">
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-600">No image</div>
        )}
        {product.discountPercent > 0 && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            -{product.discountPercent}%
          </span>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs text-fuchsia-400 uppercase tracking-wide mb-1">{product.category}</p>
        <h3 className="font-semibold text-white mb-2 line-clamp-1">{product.name}</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-emerald-400">{product.finalPrice.toLocaleString()}đ</span>
          {product.discountPercent > 0 && (
            <span className="text-sm text-neutral-500 line-through">{product.price.toLocaleString()}đ</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
