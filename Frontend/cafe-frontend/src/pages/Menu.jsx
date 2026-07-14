import { useEffect, useMemo, useState } from 'react';
import api from '../api';
import ProductCard from '../components/ProductCard';

export default function Menu() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .getProducts()
      .then((data) => {
        if (!cancelled) setProducts(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Could not load the menu.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [products]);

  const filtered = useMemo(() => {
    if (category === 'All') return products;
    return products.filter((p) => p.category === category);
  }, [products, category]);

  return (
    <div className="page">
      <div className="container">
        <section className="hero">
          <div className="hero-eyebrow">Today's board</div>
          <h1>
            Roasted slow.
            <br />
            Served <em>right now.</em>
          </h1>
          <p>
            Every cup and plate on this menu is pulled live from our kitchen ticket
            system — what you see is what's actually in stock.
          </p>
        </section>

        {categories.length > 1 && (
          <div className="category-row">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`category-chip${cat === category ? ' active' : ''}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {loading && <div className="spinner-wrap">Pulling today's board…</div>}

        {!loading && error && (
          <div className="empty-state">
            Couldn't reach the kitchen: {error}
            <br />
            Make sure the backend is running at the configured API URL.
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="empty-state">Nothing on the board yet. Check back soon.</div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="product-grid">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
