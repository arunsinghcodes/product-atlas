import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Product } from '../types/product';
import { ProductCard } from '../components/product/ProductCard';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Search, ArrowRight, Frown } from 'lucide-react';

export const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function executeSearch() {
      if (!query.trim()) {
        setProducts([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        // AC-3: WHEN I click the search button THEN I only see products that have text matching that search term
        const results = await api.searchProducts(query);
        if (isMounted) {
          setProducts(results);
        }
      } catch (err) {
        if (isMounted) {
          setError((err as Error).message || 'Failed to search products');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    executeSearch();
    return () => {
      isMounted = false;
    };
  }, [query]);

  return (
    <div className="space-y-8 pb-16">
      <Breadcrumbs items={[{ label: 'Search Results' }]} />

      {/* Search Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Search Results
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {query ? (
                <span>
                  Showing matches for <strong className="text-slate-800 font-semibold">"{query}"</strong> ({products.length} found)
                </span>
              ) : (
                'Please enter a search term to find products.'
              )}
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message={`Searching catalogue for "${query}"...`} size="lg" />
      ) : error ? (
        <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-center text-sm text-red-600">
          {error}
        </div>
      ) : products.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-slate-200/80 p-8 max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
            <Frown className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No matching products found</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            We couldn't find any items matching "{query}". Try checking your spelling or search by general categories like "jacket", "ssd", "gold", or "shirt".
          </p>
          <div className="pt-2">
            <Link
              to="/products"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-xl hover:bg-blue-700 transition-colors"
            >
              <span>Explore All Products</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              badge="Match"
              badgeColor="emerald"
            />
          ))}
        </div>
      )}
    </div>
  );
};

