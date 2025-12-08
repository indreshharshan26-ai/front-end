import React, { createContext, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Create Auth context
const AuthContext = createContext()

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  // Login function
  const login = (userData) => {
    setUser(userData)
    navigate('/dashboard') // Redirect to Dashboard after login
  }

  // Logout function
  const logout = () => {
    setUser(null)
    navigate('/login') // Redirect to Login after logout
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook to use Auth context
export const useAuth = () => useContext(AuthContext)
