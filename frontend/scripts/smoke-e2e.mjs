// Minimal E2E smoke using global fetch; run with: node scripts/smoke-e2e.mjs

const BASE = 'http://localhost:8080/api';

async function login(username, password) {
  const res = await fetch(`${BASE}/auth/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) throw new Error(`login failed: ${res.status} ${await res.text()}`);
  return res.json();
}

async function get(path, token) {
  const res = await fetch(`${BASE}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error(`${path} failed: ${res.status} ${await res.text()}`);
  return res.json();
}

async function post(path, token, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`${path} failed: ${res.status} ${await res.text()}`);
  const text = await res.text();
  try { return JSON.parse(text); } catch { return text; }
}

async function del(path, token) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'DELETE',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error(`${path} failed: ${res.status} ${await res.text()}`);
  return res.text();
}

(async () => {
  try {
    console.log('Public trips...');
    const trips = await get('/trips');
    console.log('Trips:', trips.length);

    console.log('Public restaurants...');
    const restaurants = await get('/restaurants');
    console.log('Restaurants:', restaurants.length);

    console.log('Login as testuser...');
    const auth = await login('testuser', 'test123');
    const token = auth?.token || auth?.accessToken || auth?.jwtToken;
    if (!token) throw new Error('No token in login response');

    // Join/leave first club if exists
    const clubs = await get('/clubs', token);
    if (clubs.length) {
      const clubId = clubs[0].id;
      console.log('Join club', clubId);
      await post(`/clubs/${clubId}/join`, token);
      console.log('Leave club', clubId);
      await del(`/clubs/${clubId}/leave`, token);
    }

    // Register/unregister first trip if exists
    if (trips.length) {
      const tripId = trips[0].id;
      console.log('Register trip', tripId);
      await post(`/trips/${tripId}/register?plan=NORMAL`, token);
      console.log('Unregister trip', tripId);
      await del(`/trips/${tripId}/unregister`, token);
    }

    // Create a restaurant booking if available
    if (restaurants.length) {
      const r = restaurants[0];
      const reservationDateTime = new Date(Date.now() + 86400000).toISOString();
      console.log('Create restaurant booking for', r.id);
      await post(`/restaurant-bookings`, token, {
        restaurantId: r.id,
        reservationDateTime,
        numberOfGuests: 2,
        specialRequests: 'Window seat, please.',
      });
    }

    console.log('E2E SMOKE PASS');
  } catch (e) {
    console.error('E2E SMOKE FAIL:', e.message);
    process.exit(1);
  }
})();
