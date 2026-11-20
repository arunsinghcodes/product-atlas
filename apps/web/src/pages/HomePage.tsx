import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types/product';
import { api } from '../services/api';
import { ProductCard } from '../components/product/ProductCard';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Truck, Layers } from 'lucide-react';

export const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      try {
        setLoading(true);
        // AC-1: Fetch 5 top rated products
        const [featured, cats] = await Promise.all([
          api.getFeaturedProducts(5),
          api.getCategories(),
        ]);
        if (mounted) {
          setFeaturedProducts(featured);
          setCategories(cats);
        }
      } catch (err) {
        if (mounted) {
          setError((err as Error).message || 'Failed to load catalogue');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-slate-900 via-slate-800 to-indigo-950 text-white shadow-2xl p-8 sm:p-12 lg:p-16">
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-semibold backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>AI-Native Architectural Foundation</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Curated Products, <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-indigo-300">
              Built for Growth.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
            Explore our catalog of top-rated apparel, jewelry, and electronics. Direct enquiry workflows backed by isolated adapters and enterprise-ready microservices.
          </p>

          <div className="pt-2 flex flex-wrap gap-4 items-center">
            <a
              href="#featured-section"
              className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2"
            >
              <span>Explore Top 5 Rated</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <Link
              to="/products"
              className="px-6 py-3.5 bg-white/10 hover:bg-white/15 text-white font-semibold text-sm rounded-xl backdrop-blur-xs transition-colors border border-white/10"
            >
              Browse All Products
            </Link>
          </div>
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute right-0 top-0 -mt-12 -mr-12 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 -mb-12 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Trust & Foundation Badges */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Hexagonal Architecture</h4>
            <p className="text-xs text-slate-500 mt-0.5">Frontend never connects to third-party endpoints directly.</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Instant Enquiry Dispatch</h4>
            <p className="text-xs text-slate-500 mt-0.5">Automated email alerts via local SMTP or enterprise providers.</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Resilient Fallback Cache</h4>
            <p className="text-xs text-slate-500 mt-0.5">Zero downtime guarantee even during external API latency.</p>
          </div>
        </div>
      </section>

      {/* AC-1: Featured / Top-Rated Products Section (5 Products) */}
      <section id="featured-section" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Highest Customer Ratings</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Featured Top-Rated Products
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Top 5 customer-rated selections calculated across our entire inventory.
            </p>
          </div>

          <Link
            to="/products"
            className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 shrink-0"
          >
            <span>View Full Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner message="Loading top rated selections..." />
        ) : error ? (
          <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-center text-sm text-red-600">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {featuredProducts.map((product, idx) => (
              <ProductCard
                key={product.id}
                product={product}
                badge={`Top #${idx + 1}`}
                badgeColor="amber"
              />
            ))}
          </div>
        )}
      </section>

      {/* Explore by Category Section */}
      <section className="space-y-6">
        <div className="border-b border-slate-200 pb-4">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
            <Layers className="w-3.5 h-3.5 text-blue-500" />
            <span>Structured Taxonomy</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Browse By Category
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse our organized departments with top-rated and additional collections.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category}
              to={`/categories/${encodeURIComponent(category)}`}
              className="group p-6 bg-white rounded-2xl border border-slate-200/80 hover:border-blue-500 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-blue-600 transition-colors">
                  Department
                </span>
                <h3 className="text-lg font-bold text-slate-900 capitalize mt-1 group-hover:text-blue-600 transition-colors">
                  {category}
                </h3>
              </div>

              <div className="mt-6 flex items-center justify-between text-xs font-semibold text-slate-600 group-hover:text-blue-600 transition-colors">
                <span>View Collection</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};
