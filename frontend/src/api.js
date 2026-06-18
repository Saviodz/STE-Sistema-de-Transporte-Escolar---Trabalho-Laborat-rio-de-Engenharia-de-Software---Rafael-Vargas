async function fetchAPI(method, endpoint, body = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };

  if (body) options.body = JSON.stringify(body);

  const response = await fetch(endpoint, options);
  let data;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const mensagens = Array.isArray(data?.mensagens) ? data.mensagens.join(' ') : null;
    const msg = mensagens || data?.erro || data?.mensagem || data?.message || data?.error || `Erro ${response.status}`;
    throw new Error(msg);
  }

  return data;
}

export const api = {
  get: (endpoint) => fetchAPI('GET', endpoint),
  post: (endpoint, body) => fetchAPI('POST', endpoint, body),
  put: (endpoint, body) => fetchAPI('PUT', endpoint, body),
  delete: (endpoint) => fetchAPI('DELETE', endpoint)
};

export { fetchAPI };
