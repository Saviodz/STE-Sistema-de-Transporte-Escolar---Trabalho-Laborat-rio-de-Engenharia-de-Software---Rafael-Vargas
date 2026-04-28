// ─── STE API Utility ────────────────────────────────────────────────────────
const API_BASE = '';

/**
 * Centralized fetch wrapper for the STE API.
 * @param {string} method    - HTTP method: GET | POST | PUT | DELETE
 * @param {string} endpoint  - API path starting with / (e.g. '/alunos')
 * @param {object|null} body - Request body for POST / PUT
 * @returns {Promise<any>}   - Parsed JSON response
 */
async function fetchAPI(method, endpoint, body = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body) options.body = JSON.stringify(body);

  const response = await fetch(`${API_BASE}${endpoint}`, options);

  let data;
  try { data = await response.json(); } catch { data = null; }

  if (!response.ok) {
    const msg = data?.mensagem || data?.message || data?.error || `Erro ${response.status}`;
    throw new Error(msg);
  }

  return data;
}

// Convenience shortcuts
const api = {
  get:    (endpoint)        => fetchAPI('GET',    endpoint),
  post:   (endpoint, body)  => fetchAPI('POST',   endpoint, body),
  put:    (endpoint, body)  => fetchAPI('PUT',    endpoint, body),
  delete: (endpoint)        => fetchAPI('DELETE', endpoint),
};

export { api, fetchAPI };
