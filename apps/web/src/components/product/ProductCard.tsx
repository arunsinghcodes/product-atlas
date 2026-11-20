import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types/product';
import { RatingStars } from './RatingStars';
import { ArrowRight, Tag } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  badge?: string;
  badgeColor?: 'blue' | 'amber' | 'emerald';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  badge,
  badgeColor = 'blue',
}) => {
  const badgeClasses = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Product Image Area */}
      <div className="relative w-full pt-[85%] bg-white p-6 overflow-hidden flex items-center justify-center">
        <img
          src={product.image}
          alt={product.title}
          className="absolute inset-0 w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {badge && (
          <span
            className={`absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold rounded-full border shadow-xs ${badgeClasses[badgeColor]}`}
          >
            {badge}
          </span>
        )}
        <span className="absolute top-3 right-3 text-[11px] font-medium text-slate-500 bg-slate-100/90 backdrop-blur-xs px-2 py-0.5 rounded-md capitalize flex items-center gap-1">
          <Tag className="w-3 h-3 text-slate-400" />
          {product.category}
        </span>
      </div>

      {/* Product Content */}
      <div className="p-5 flex-1 flex flex-col justify-between border-t border-slate-100 bg-linear-to-b from-white to-slate-50/40">
        <div>
          <div className="mb-2">
            <RatingStars rate={product.rating.rate} count={product.rating.count} size="sm" />
          </div>

          <Link to={`/products/${product.id}`} className="block">
            <h3 className="font-semibold text-slate-900 line-clamp-2 text-base leading-snug group-hover:text-blue-600 transition-colors">
              {product.title}
            </h3>
          </Link>

          <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Price</span>
            <span className="text-xl font-bold text-slate-900">
              ${product.price.toFixed(2)}
            </span>
          </div>

          <Link
            to={`/products/${product.id}`}
            className="inline-flex items-center gap-1 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-xl hover:bg-blue-600 transition-colors shadow-xs"
          >
            <span>Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
