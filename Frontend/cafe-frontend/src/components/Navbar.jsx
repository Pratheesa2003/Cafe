import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { isAuthenticated, email, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="brand">
          <span className="brand-mark">Ember &amp; Oak</span>
          <span className="brand-tag">Café No. 8</span>
        </NavLink>

        <nav className="nav-links">
          <NavLink to="/" end className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            Menu
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/orders" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              My Orders
            </NavLink>
          )}
        </nav>

        <div className="nav-user">
          <NavLink to="/cart" className="nav-cart-btn">
            Cart
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </NavLink>

          {isAuthenticated ? (
            <>
              <span title={email}>{email?.split('@')[0]}</span>
              <button
                className="btn-ghost"
                onClick={() => {
                  logout();
                  navigate('/');
                }}
              >
                Log out
              </button>
            </>
          ) : (
            <NavLink to="/login" className="btn-ghost">
              Log in
            </NavLink>
          )}
        </div>
      </div>
    </header>
  );
}
