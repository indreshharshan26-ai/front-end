import React, { useState } from 'react'
import axios from 'axios'
import { useAuth } from '../utils/auth'
import { API_URL } from '../utils/api'
import bgPoster from '../assets/bg.jpg'

export default function Login() {
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState(null) // Can be string or JSX
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) {
      setError('Please fill both fields')
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      const res = await axios.post(
        `${API_URL}/api/login`,
        form,
        { 
          withCredentials: true,
          timeout: 10000, // 10 second timeout
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      
      if (res.data && res.data.user) {
        login(res.data.user) // Login successful → dashboard
        setError(null)
      } else {
        setError('Invalid response from server')
      }
    } catch (err) {
      // Better error handling with helpful messages
      console.error('Login error:', err)
      console.error('API URL being used:', API_URL)
      
      if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
        setError('Request timeout. The backend may be sleeping (Render free tier). Please wait 30-60 seconds and try again.')
      } else if (err.code === 'ERR_NETWORK' || err.message.includes('Network Error') || err.message.includes('Failed to fetch')) {
        // Check if API URL is the placeholder
        if (API_URL.includes('your-backend-url.onrender.com')) {
          setError(
            <div className="space-y-2">
              <p className="font-semibold">Backend not configured!</p>
              <p className="text-xs">The backend URL is not set. Please:</p>
              <ol className="text-xs list-decimal list-inside space-y-1">
                <li>Deploy backend to Render (see DEPLOY_BACKEND.md)</li>
                <li>Go to Vercel Dashboard → Settings → Environment Variables</li>
                <li>Add: VITE_API_URL = your-backend-url.onrender.com</li>
                <li>Redeploy your frontend</li>
              </ol>
              <p className="text-xs mt-2">Current API URL: <span className="font-mono text-red-300">{API_URL}</span></p>
            </div>
          )
        } else {
          setError(
            <div className="space-y-2">
              <p className="font-semibold">Cannot connect to backend server!</p>
              <p className="text-xs">Trying to connect to: <span className="font-mono text-red-300">{API_URL}</span></p>
              <p className="text-xs">Please ensure:</p>
              <ul className="text-xs list-disc list-inside space-y-1">
                <li>Backend is deployed and running</li>
                <li>Backend URL is correct in Vercel environment variables</li>
                <li>Backend is not sleeping (Render free tier sleeps after 15 min)</li>
              </ul>
            </div>
          )
        }
      } else if (err.response) {
        // Server responded with error status
        setError(err.response.data?.message || `Server error: ${err.response.status}`)
      } else {
        setError(err.message || 'An unexpected error occurred. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center relative font-sans"
      style={{ backgroundImage: `url(${bgPoster})` }}
    >
      <div className="absolute inset-0 bg-black/70"></div>

      {/* Netflix Logo */}
      <h1
        className="ml-12 mt-6 relative z-10 text-red-600 text-5xl font-bebas"
        style={{ fontFamily: 'Bebas Neue' }}
      >
        Netflix
      </h1>

      {/* Login card */}
      <div className="relative z-10 flex items-center justify-center min-h-screen -mt-20">
        <div className="w-full max-w-md p-10 bg-black/70 rounded-md shadow-lg">
          <h2 className="text-white text-3xl font-bold mb-6">Sign In</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email or phone number"
              className="w-full px-4 py-3 rounded bg-[#333] placeholder:text-gray-400 text-white"
            />

            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full px-4 py-3 rounded bg-[#333] placeholder:text-gray-400 text-white"
            />

            {error && (
              <div className="text-red-400 text-sm bg-red-900/30 p-3 rounded border border-red-800">
                {typeof error === 'string' ? <p>{error}</p> : error}
              </div>
            )}

            <button
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white py-3 rounded"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="bg-red-900/50 p-4 rounded mt-6 text-gray-300">
            <h3 className="text-center text-lg font-semibold text-white mb-2">
              Demo Credentials
            </h3>
            <p>Email: <span className="text-gray-300">demo@netflix.com</span></p>
            <p>Password: <span className="text-gray-300">password123</span></p>
          </div>
        </div>
      </div>
    </div>
  )
}
