import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { CategoryProductsResponse, Product } from '../types/product';
import { ProductCard } from '../components/product/ProductCard';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Star, Layers, PackageCheck, AlertCircle } from 'lucide-react';

export const CategoryPage: React.FC = () => {
  const { category: rawCategory } = useParams<{ category: string }>();
  const category = decodeURIComponent(rawCategory || '');

  const [data, setData] = useState<CategoryProductsResponse | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchCategoryData() {
      if (!category) return;
      try {
        setLoading(true);
        setError(null);
        const [catData, allCats] = await Promise.all([
          api.getCategoryProducts(category),
          api.getCategories(),
        ]);
        if (isMounted) {
          setData(catData);
          setCategories(allCats);
        }
      } catch (err) {
        if (isMounted) {
          setError((err as Error).message || 'Failed to load category products');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchCategoryData();
    return () => {
      isMounted = false;
    };
  }, [category]);

  if (loading) {
    return <LoadingSpinner message={`Loading ${category} collection...`} size="lg" />;
  }

  if (error || !data) {
    return (
      <div className="py-12 space-y-4 max-w-xl mx-auto text-center">
        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Category Not Found</h2>
        <p className="text-sm text-slate-600">{error || 'Unable to retrieve category products.'}</p>
        <Link
          to="/"
          className="inline-block px-5 py-2.5 bg-blue-600 text-white text-xs font-semibold rounded-xl"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-16">
      {/* Breadcrumb Navigation */}
      <Breadcrumbs
        items={[
          { label: 'Categories', to: '/products' },
          { label: category },
        ]}
      />

      {/* Category Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">
            <Layers className="w-3.5 h-3.5 text-blue-500" />
            <span>Category View</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 capitalize">
            {category}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Showing {data.total} products organized into Top Rated and Additional selections.
          </p>
        </div>

        {/* Quick category switcher pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => {
            const isCurrent = c.toLowerCase() === category.toLowerCase();
            return (
              <Link
                key={c}
                to={`/categories/${encodeURIComponent(c)}`}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                  isCurrent
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {c}
              </Link>
            );
          })}
        </div>
      </div>

      {/* AC-2 Section 1: Top Rated products for that category */}
      <section className="space-y-6">
        <div className="flex items-center gap-2.5 border-b border-slate-200 pb-3">
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Top Rated in {category}
            </h2>
            <p className="text-xs text-slate-500">
              Highest rated customer favorites in this category ({data.topRated.length} items)
            </p>
          </div>
        </div>

        {data.topRated.length === 0 ? (
          <p className="text-xs text-slate-500 italic py-4">No top-rated items in this category.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data.topRated.map((product: Product) => (
              <ProductCard
                key={product.id}
                product={product}
                badge="Top Rated"
                badgeColor="amber"
              />
            ))}
          </div>
        )}
      </section>

      {/* AC-2 Section 2: Additional products in that category */}
      <section className="space-y-6 pt-4">
        <div className="flex items-center gap-2.5 border-b border-slate-200 pb-3">
          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
            <PackageCheck className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Additional Products in {category}
            </h2>
            <p className="text-xs text-slate-500">
              Explore more selections in this collection ({data.additional.length} items)
            </p>
          </div>
        </div>

        {data.additional.length === 0 ? (
          <div className="p-8 bg-white border border-slate-200/80 rounded-2xl text-center text-xs text-slate-500">
            All products in this category are currently featured in the Top Rated section above!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data.additional.map((product: Product) => (
              <ProductCard
                key={product.id}
                product={product}
                badge="Collection"
                badgeColor="blue"
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
