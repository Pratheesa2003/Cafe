import { useEffect, useState } from 'react';
import api from '../api';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    api
      .getMyOrders()
      .then((data) => {
        if (!cancelled) setOrders(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Could not load orders.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="page">
      <div className="container">
        <h2 className="section-title">My orders</h2>
        <p className="section-sub">Past tickets, pulled straight from the kitchen log.</p>

        {loading && <div className="spinner-wrap">Fetching your history…</div>}
        {!loading && error && <div className="empty-state">Couldn't load orders: {error}</div>}
        {!loading && !error && orders.length === 0 && (
          <div className="empty-state">
            No orders yet. <a href="/">Go place your first one.</a>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div style={{ display: 'grid', gap: 20, maxWidth: 520 }}>
            {orders.map((order) => (
              <div className="ticket" key={order.id}>
                <div className="ticket-header">
                  <span>{order.orderNumber}</span>
                  <span className="status-pill">{order.status}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--cream-dim)', marginBottom: 8 }}>
                  {order.orderTime && new Date(order.orderTime).toLocaleString()}
                </div>
                {(order.items || []).map((item, idx) => (
                  <div className="ticket-line" key={idx}>
                    <div className="ticket-line-name">
                      <div>{item.productName}</div>
                      <div className="ticket-line-sub">× {item.quantity}</div>
                    </div>
                    <div className="ticket-line-amount">${Number(item.subtotal).toFixed(2)}</div>
                  </div>
                ))}
                <div className="ticket-total">
                  <span>Total</span>
                  <span>${Number(order.totalAmount).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
