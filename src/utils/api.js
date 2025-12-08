// API Configuration
const getApiUrl = () => {
  // Priority 1: Use environment variable if set
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }
  
  // Priority 2: In production, check if we can infer backend URL
  if (import.meta.env.PROD) {
    // Try to construct backend URL from current origin
    const origin = window.location.origin
    // If frontend is on Vercel, backend might be on Render/Railway
    // For now, return a placeholder that user must set
    console.warn('VITE_API_URL not set in production. Please set it in Vercel environment variables.')
    return 'https://your-backend-url.onrender.com' // User must replace this
  }
  
  // Priority 3: Development - use localhost
  return 'http://localhost:4000'
}

export const API_URL = getApiUrl()

// Log API URL for debugging (both dev and prod)
console.log('🔗 API URL:', API_URL)
if (API_URL.includes('your-backend-url.onrender.com')) {
  console.warn('⚠️ WARNING: Backend URL not configured! Set VITE_API_URL in Vercel environment variables.')
}

// Helper function to make API calls with better error handling
export const apiRequest = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Server error' }))
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Cannot connect to server. Please check if the backend is running.')
    }
    throw error
  }
}

