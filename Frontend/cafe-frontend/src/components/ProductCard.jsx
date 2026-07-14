import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const price = Number(product.price).toFixed(2);
  const outOfStock = product.isAvailable === false || product.stockQuantity === 0;
  const lowStock = !outOfStock && product.stockQuantity != null && product.stockQuantity <= 5;

  return (
    <div className="product-card">
      <div className="product-media">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} onError={(e) => { e.target.style.display = 'none'; }} />
        ) : (
          <span>{product.name}</span>
        )}
      </div>
      <div className="product-body">
        <h3 className="product-name">{product.name}</h3>
        {product.description && <p className="product-desc">{product.description}</p>}
        <div className="product-foot">
          <span className="product-price">${price}</span>
          {outOfStock && <span className="tag tag-out">Sold out</span>}
          {lowStock && <span className="tag tag-low">{product.stockQuantity} left</span>}
        </div>
        <button
          className="btn-add"
          disabled={outOfStock}
          onClick={() => addItem(product)}
        >
          {outOfStock ? 'Unavailable' : 'Add to order'}
        </button>
      </div>
    </div>
  );
}
