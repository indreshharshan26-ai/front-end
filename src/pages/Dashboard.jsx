import React from 'react'
import { useAuth } from '../utils/auth'
import profilePic from '../assets/profile.jpg'  // Add your profile image here

export default function Dashboard() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-black font-sans">
      {/* Header */}
      <header className="flex justify-between items-center p-6 bg-black/80">
        <div className="text-4xl font-bold text-red-600 font-bebas">NETFLIX</div>
        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white transition"
        >
          Sign Out
        </button>
      </header>

      {/* Main content */}
      <main className="flex items-center justify-center mt-16 text-center px-4">
        <div className="bg-black/80 backdrop-blur-md p-10 rounded-lg shadow-lg max-w-lg w-full font-roboto">
          {/* Profile Image */}
          <div className="w-24 h-24 mx-auto rounded-full overflow-hidden mb-6 border-2 border-red-600 shadow-lg">
            <img
              src={profilePic}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>

          {/* Welcome Text */}
          <h2 className="text-3xl font-bold mb-2 text-white">
            Welcome back, {user?.name}!
          </h2>
          <p className="text-gray-400 mb-6">{user?.email}</p>

          <div className="inline-block border border-green-600 rounded-full px-6 py-2 text-green-300">
            ✔ Successfully logged in
          </div>
        </div>
      </main>
    </div>
  )
}
