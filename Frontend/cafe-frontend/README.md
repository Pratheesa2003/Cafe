# Ember & Oak Café — Frontend

React + Vite frontend wired to your Spring Boot `Cafe/Backend/backend` API.

## Endpoints it uses

| Purpose        | Method | Path                      |
|-----------------|--------|---------------------------|
| Register        | POST   | `/api/auth/register`      |
| Login           | POST   | `/api/auth/login`         |
| List products   | GET    | `/api/products`           |
| Get product     | GET    | `/api/products/{id}`      |
| Create order    | POST   | `/api/orders/create`      |
| My orders       | GET    | `/api/orders/my-orders`   |

## Setup

1. Start your backend (default `http://localhost:8080`).
2. Install and run the frontend:

```bash
npm install
npm run dev
```

3. Open the printed local URL (default `http://localhost:5173`).

## Configuring the API URL

Edit `.env`:

```
VITE_API_URL=http://localhost:8080
```

Point this at wherever your backend is deployed (e.g. your Docker/Azure URL) and restart `npm run dev`.

## Notes on the backend as-is

- `SecurityConfig` currently `permitAll`s every route and disables CORS handling at the Spring Security layer — that's why this frontend can call the API directly with no proxy. If you re-enable auth checks later, you'll want to also add a proper CORS config and have this app send the JWT (it already stores and attaches it as `Authorization: Bearer <token>` on every request, ready for when you wire that up).
- `OrderController.getCurrentUser()` currently just returns the **first user row** in the database rather than resolving the logged-in user from the JWT. So "My Orders" and "Create Order" aren't actually scoped to whoever is logged in yet — every order goes to that first user. The frontend still requires login for a sane UX, but you'll want to fix that method (decode the JWT / use Spring Security's principal) to make per-user orders work correctly.
- `Product` fields used: `name`, `description`, `price`, `category`, `stockQuantity`, `imageUrl`, `isAvailable`. Products with `isAvailable: false` or `stockQuantity: 0` show as sold out.

## Structure

```
src/
  api.js                 # fetch wrapper for all backend calls
  context/AuthContext.jsx
  context/CartContext.jsx
  components/Navbar.jsx
  components/ProductCard.jsx
  components/ProtectedRoute.jsx
  pages/Menu.jsx
  pages/Login.jsx
  pages/Register.jsx
  pages/Cart.jsx
  pages/Orders.jsx
```
