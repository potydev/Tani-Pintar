// Centralized API Client for TaniPintar
// Handles base URL resolution, robust error handling, 502/504 Bad Gateway resilience, and safe JSON parsing.

export const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  // In browser, default to '/api' which works with Vite proxy in dev and Express static in production
  return '/api';
};

export const API_BASE_URL = getApiBaseUrl();

/**
 * Safely parse response body as JSON with fallback for non-JSON / HTML 502 responses
 */
export async function safeParseResponse(res) {
  const contentType = res.headers.get('content-type') || '';
  
  if (contentType.includes('application/json')) {
    try {
      const data = await res.json();
      return { ok: res.ok, status: res.status, data };
    } catch (parseErr) {
      console.warn('[API Client] Failed to parse JSON response:', parseErr);
      return {
        ok: false,
        status: res.status,
        data: {
          success: false,
          error: 'Format data respon server tidak valid.'
        }
      };
    }
  }

  // Non-JSON response (e.g. 502 Bad Gateway HTML from proxy/nginx/apache)
  try {
    const text = await res.text();
    const isBadGateway = res.status === 502 || text.includes('502 Bad Gateway') || text.includes('ECONNREFUSED');
    const isGatewayTimeout = res.status === 504 || text.includes('504 Gateway');
    
    let errorMsg = `Server error (${res.status})`;
    if (isBadGateway) {
      errorMsg = '502 Bad Gateway: Layanan server backend belum aktif atau tidak merespon.';
    } else if (isGatewayTimeout) {
      errorMsg = '504 Gateway Timeout: Permintaan waktu tunggu server habis.';
    } else if (res.status === 404) {
      errorMsg = '404 Not Found: Endpoint API tidak ditemukan.';
    }

    return {
      ok: false,
      status: res.status,
      isBadGateway,
      data: {
        success: false,
        isBadGateway,
        error: errorMsg,
        rawText: text.slice(0, 300)
      }
    };
  } catch (readErr) {
    return {
      ok: false,
      status: res.status,
      data: {
        success: false,
        error: `Server merespon dengan status ${res.status}`
      }
    };
  }
}

/**
 * Robust fetch wrapper with automatic URL prefixing and connection error catching
 */
export async function safeApiFetch(endpoint, options = {}) {
  let fullUrl = endpoint;

  if (endpoint.startsWith('/api')) {
    fullUrl = `${API_BASE_URL}${endpoint.slice(4)}`;
  } else if (!endpoint.startsWith('http://') && !endpoint.startsWith('https://')) {
    fullUrl = `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
  }

  try {
    const res = await fetch(fullUrl, {
      ...options,
      headers: {
        'Accept': 'application/json',
        ...(options.body && typeof options.body === 'string' ? { 'Content-Type': 'application/json' } : {}),
        ...options.headers
      }
    });

    return await safeParseResponse(res);
  } catch (networkErr) {
    console.warn(`[API Client Network Error] Failed to fetch ${fullUrl}:`, networkErr.message);
    return {
      ok: false,
      status: 0,
      isBadGateway: true,
      data: {
        success: false,
        isBadGateway: true,
        error: 'Tidak dapat terhubung ke server backend. Pastikan server lokal/proxy sedang aktif.',
        details: networkErr.message
      }
    };
  }
}

export async function apiGet(endpoint, options = {}) {
  return safeApiFetch(endpoint, { method: 'GET', ...options });
}

export async function apiPost(endpoint, body, options = {}) {
  return safeApiFetch(endpoint, {
    method: 'POST',
    body: typeof body === 'string' ? body : JSON.stringify(body),
    ...options
  });
}

export async function apiPatch(endpoint, body, options = {}) {
  return safeApiFetch(endpoint, {
    method: 'PATCH',
    body: typeof body === 'string' ? body : JSON.stringify(body),
    ...options
  });
}

export async function apiDelete(endpoint, options = {}) {
  return safeApiFetch(endpoint, { method: 'DELETE', ...options });
}

export default {
  getApiBaseUrl,
  API_BASE_URL,
  safeParseResponse,
  safeApiFetch,
  apiGet,
  apiPost,
  apiPatch,
  apiDelete
};
