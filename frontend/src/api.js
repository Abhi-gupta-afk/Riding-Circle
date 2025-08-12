// Centralized API utility for RideCircle frontend
const API_BASE = '/api';

export async function apiGet(path) {
  const token = localStorage.getItem('authToken');
  const res = await fetch(`${API_BASE}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    credentials: 'include',
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function apiPost(path, data, token = null) {
  const authToken = token || localStorage.getItem('authToken');
  try {
    console.log('API POST Request:', {
      url: `${API_BASE}${path}`,
      data: data,
      hasToken: !!authToken
    });
    
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    
    console.log('API POST Response:', {
      status: res.status,
      statusText: res.statusText,
      ok: res.ok
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('API POST Error Response:', errorText);
      throw new Error(errorText);
    }
    
    const result = await res.json();
    console.log('API POST Success:', result);
    return result;
  } catch (error) {
    console.error('API POST Fetch Error:', error);
    throw error;
  }
}

export async function apiPut(path, data, token = null) {
  const authToken = token || localStorage.getItem('authToken');
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    },
    body: JSON.stringify(data),
    credentials: 'include',
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function apiDelete(path) {
  const token = localStorage.getItem('authToken');
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'DELETE',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    credentials: 'include',
  });
  if (!res.ok) throw new Error(await res.text());
  return res;
}
