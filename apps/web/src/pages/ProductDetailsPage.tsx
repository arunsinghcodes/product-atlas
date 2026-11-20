import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Product } from '../types/product';
import { RatingStars } from '../components/product/RatingStars';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { EnquiryModal } from '../components/enquiry/EnquiryModal';
import { MessageSquare, ShieldCheck, Truck, RefreshCw, AlertCircle, ArrowLeft } from 'lucide-react';

export const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadProduct() {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        // AC-4: Product details endpoint
        const data = await api.getProductById(id);
        if (isMounted) {
          setProduct(data);
        }
      } catch (err) {
        if (isMounted) {
          setError((err as Error).message || 'Product not found');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadProduct();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return <LoadingSpinner message="Loading product details..." size="lg" />;
  }

  if (error || !product) {
    return (
      <div className="py-16 text-center max-w-md mx-auto space-y-4">
        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Product Not Found</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          The requested product ID could not be retrieved from the catalog backend.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Products</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Breadcrumbs (AC-4) */}
      <Breadcrumbs
        items={[
          { label: 'Products', to: '/products' },
          { label: product.category, to: `/categories/${encodeURIComponent(product.category)}` },
          { label: product.title },
        ]}
      />

      {/* Main Product Showcase Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-10">
        {/* Left Column: Image Area */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center bg-slate-50/60 rounded-2xl p-8 border border-slate-100 relative group">
          <img
            src={product.image}
            alt={product.title}
            className="w-full max-h-[420px] object-contain transition-transform duration-300 group-hover:scale-105"
          />
          <span className="absolute top-4 left-4 text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
            {product.category}
          </span>
        </div>

        {/* Right Column: Details & Actions */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              {product.title}
            </h1>

            {/* Rating and Reviews */}
            <div className="flex items-center gap-3 pt-1">
              <RatingStars rate={product.rating.rate} count={product.rating.count} size="md" />
              <span className="text-slate-300">•</span>
              <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                In Stock & Ready to Order
              </span>
            </div>

            {/* Price Tag */}
            <div className="py-3 border-y border-slate-100 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-slate-900">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-xs text-slate-400 font-medium">USD • Tax included</span>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Description & Specifications
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          </div>

          {/* AC-5 CTA: Enquire Button */}
          <div className="pt-4 space-y-4">
            <button
              onClick={() => setIsEnquiryModalOpen(true)}
              className="w-full py-4 px-8 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-2xl transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 group cursor-pointer"
            >
              <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Enquire About This Product</span>
            </button>

            {/* Guarantee Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-slate-500 text-xs">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <Truck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Fast Worldwide Delivery</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Verified Authenticity</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <RefreshCw className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>30-Day Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enquiry Modal Component (AC-5) */}
      <EnquiryModal
        product={product}
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
      />
    </div>
  );
};
