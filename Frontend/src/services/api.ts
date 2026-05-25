const BASE_URL = 'http://localhost:3000';

function getHeaders(): HeadersInit {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function handleResponse(res: Response) {
  if (!res.ok) {
    const text = await res.text();
    throw new ApiError(text, res.status);
  }
  return res.status !== 204 ? res.json() : null;
}

export const api = {
  async post(endpoint: string, body: any) {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body),
    });
    return handleResponse(res);
  },

  async get(endpoint: string) {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async patch(endpoint: string, body?: any) {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    return handleResponse(res);
  },

  async delete(endpoint: string) {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
};