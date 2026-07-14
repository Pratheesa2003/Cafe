import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api';

export default function Cart() {
  const { items, updateQuantity, removeItem, totalAmount, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');
  const [confirmation, setConfirmation] = useState(null);

  async function handlePlaceOrder() {
    setError('');
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setPlacing(true);
    try {
      const res = await api.createOrder(items);
      setConfirmation(res);
      clearCart();
    } catch (err) {
      setError(err.message || 'Could not place the order.');
    } finally {
      setPlacing(false);
    }
  }

  if (confirmation) {
    return (
      <div className="page">
        <div className="container auth-shell">
          <div className="ticket">
            <div className="ticket-header">
              <span>Order confirmed</span>
              <span>{confirmation.orderNumber}</span>
            </div>
            <p style={{ color: 'var(--cream-dim)', fontSize: 14 }}>
              Your order is in. Total charged:
            </p>
            <div className="ticket-total">
              <span>Total</span>
              <span>${Number(confirmation.totalAmount).toFixed(2)}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
            <button className="btn-primary" onClick={() => navigate('/orders')}>
              View my orders
            </button>
            <button className="btn-ghost" onClick={() => navigate('/')}>
              Back to menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <h2 className="section-title">Your order</h2>
        <p className="section-sub">Review your ticket before it goes to the kitchen.</p>

        {error && <div className="alert alert-error" style={{ maxWidth: 480 }}>{error}</div>}

        {items.length === 0 ? (
          <div className="empty-state">
            Your ticket is empty. <a href="/">Browse the menu</a> to add something.
          </div>
        ) : (
          <div style={{ maxWidth: 480 }}>
            <div className="ticket">
              <div className="ticket-header">
                <span>Ticket</span>
                <span>{items.length} item{items.length > 1 ? 's' : ''}</span>
              </div>

              {items.map((item) => (
                <div className="ticket-line" key={item.productId}>
                  <div className="ticket-line-name">
                    <div>{item.name}</div>
                    <div className="ticket-line-sub">${item.price.toFixed(2)} each</div>
                  </div>
                  <div className="qty-control">
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <div className="ticket-line-amount">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}

              <div className="ticket-total">
                <span>Total</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
              <button className="remove-link" onClick={clearCart}>
                Clear ticket
              </button>
              <button className="btn-primary" style={{ width: 'auto', padding: '10px 24px' }} onClick={handlePlaceOrder} disabled={placing}>
                {placing ? 'Sending to kitchen…' : isAuthenticated ? 'Place order' : 'Log in to order'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
