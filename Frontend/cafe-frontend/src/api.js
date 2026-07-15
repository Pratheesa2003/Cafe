const API_URL =
  import.meta.env.VITE_API_URL ||
  'https://cafe-backend-code-f8fkedctaqdbcafy.southeastasia-01.azurewebsites.net';

async function request(path, options = {}) {
  const token = localStorage.getItem('cafe_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const contentType = res.headers.get('content-type') || '';
  const body = contentType.includes('application/json')
    ? await res.json().catch(() => null)
    : await res.text().catch(() => null);

  if (!res.ok) {
    const message =
      (body && typeof body === 'object' && (body.error || body.message)) ||
      (typeof body === 'string' && body) ||
      `Request failed (${res.status})`;

    throw new Error(message);
  }

  return body;
}

export const api = {
  // Authentication
  register: (data) =>
    request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (email, password) =>
    request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  // Products
  getProducts: () => request('/api/products'),

  getProduct: (id) => request(`/api/products/${id}`),

  createProduct: (product) =>
    request('/api/products', {
      method: 'POST',
      body: JSON.stringify(product),
    }),

  // Orders
  createOrder: (items) =>
    request('/api/orders/create', {
      method: 'POST',
      body: JSON.stringify({
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
        })),
      }),
    }),

  getMyOrders: () => request('/api/orders/my-orders'),
};

export default api;