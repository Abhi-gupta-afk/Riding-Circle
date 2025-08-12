// Utility to get current user from JWT (if needed)
export function getToken() {
  return localStorage.getItem('authToken');
}

export function isLoggedIn() {
  return !!getToken();
}

// Check if current user is admin
export function isAdmin() {
  const roles = localStorage.getItem('userRoles');
  if (!roles) return false;
  
  try {
    const roleArray = JSON.parse(roles);
    return roleArray && roleArray.includes('ROLE_ADMIN');
  } catch {
    return false;
  }
}

// Store user roles in localStorage
export function setUserRoles(roles) {
  localStorage.setItem('userRoles', JSON.stringify(roles));
}

// Clear user data on logout
export function clearUserData() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userRoles');
}

// Optionally decode JWT for user info
export function parseJwt(token) {
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}
