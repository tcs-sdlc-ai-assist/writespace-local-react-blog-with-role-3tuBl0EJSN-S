import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login, getCurrentUser } from '../utils/session'
import Navbar from '../components/Navbar'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const user = getCurrentUser()
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin', { replace: true })
      } else {
        navigate('/blogs', { replace: true })
      }
    }
  }, [navigate])

  function handleSubmit(e) {
    e.preventDefault()
    setError('')

    const result = login(username, password)

    if (result.success) {
      if (result.user.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/blogs')
      }
    } else {
      setError(result.error)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Gradient Header Accent */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 px-8 py-6">
              <h1 className="text-2xl font-bold text-white text-center">
                Welcome Back
              </h1>
              <p className="text-indigo-100 text-center text-sm mt-1">
                Sign in to your WriteSpace account
              </p>
            </div>

            <div className="px-8 py-8">
              {error && (
                <div className="mb-4 text-red-500 text-sm text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                    placeholder="Enter your username"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                    placeholder="Enter your password"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium transition-colors cursor-pointer mt-2"
                >
                  Login
                </button>
              </form>

              <p className="text-center text-sm text-gray-600 mt-6">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                >
                  Register here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}