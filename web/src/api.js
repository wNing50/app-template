const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export async function fetchPublicConfig() {
  if (!API_BASE_URL) {
    return { environment: import.meta.env.MODE, apiBasePath: '', localOnly: true };
  }

  const response = await fetch(`${API_BASE_URL}/public/config`);
  if (!response.ok) {
    throw new Error(`Public config request failed: ${response.status}`);
  }
  return response.json();
}
