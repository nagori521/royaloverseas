const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';

function token() {
  return localStorage.getItem('royalAdminToken');
}

async function request(path, options = {}) {
  const isFormData = options.body instanceof FormData;
  const body =
    options.body && !isFormData && typeof options.body !== 'string'
      ? JSON.stringify(options.body)
      : options.body;
  const headers = isFormData ? {} : { 'Content-Type': 'application/json' };
  const authToken = token();

  if (authToken) headers.Authorization = `Bearer ${authToken}`;

  try {
    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      body,
      headers: { ...headers, ...options.headers },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'API request failed' }));
      throw new Error(error.message || `API error: ${response.status}`);
    }

    return response.json();
  } catch (err) {
    throw new Error(err.message || 'API request failed');
  }
}

export const api = {
  get: (path) => request(path),
  post: (path, payload) => request(path, { method: 'POST', body: payload }),
  put: (path, payload) => request(path, { method: 'PUT', body: payload }),
  delete: (path) => request(path, { method: 'DELETE' }),
  login: (payload) => request('/api/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  products: () => request('/api/products'),
  product: (id) => request(`/api/products/${id}`),
  createProduct: (payload) => request('/api/products', { method: 'POST', body: payload }),
  updateProduct: (id, payload) => request(`/api/products/${id}`, { method: 'PUT', body: payload }),
  deleteProduct: (id) => request(`/api/products/${id}`, { method: 'DELETE' }),
  gallery: () => request('/api/gallery'),
  createGallery: (payload) => request('/api/gallery', { method: 'POST', body: payload }),
  updateGallery: (id, payload) => request(`/api/gallery/${id}`, { method: 'PUT', body: payload }),
  deleteGallery: (id) => request(`/api/gallery/${id}`, { method: 'DELETE' }),
  createInquiry: (payload) => request('/api/inquiries', { method: 'POST', body: JSON.stringify(payload) }),
  inquiries: () => request('/api/inquiries'),
  updateInquiryStatus: (id, status) =>
    request(`/api/inquiries/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  deleteInquiry: (id) => request(`/api/inquiries/${id}`, { method: 'DELETE' }),
  dashboard: () => request('/api/dashboard'),
  settings: () => request('/api/settings'),
  updateSettings: (payload) => request('/api/settings', { method: 'PUT', body: payload }),
};

export function apiImage(path) {
  if (!path) return '';
  return path.startsWith('/uploads') ? `${API_URL}${path}` : path;
}
