const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export async function apiGet(path) {
  if (!API_BASE_URL) {
    return { skipped: true, reason: 'VITE_API_BASE_URL is not configured' };
  }

  const response = await fetch(`${API_BASE_URL}${path}`);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json();
}
