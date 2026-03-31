import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register, getCurrentUser } from '../utils/session'
import Navbar from '../components/Navbar'

export default function RegisterPage() {
  const [displayName, setDisplayName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
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

    const result = register({ displayName, username, password, confirmPassword })

    if (result.success) {
      navigate('/blogs')
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
                Create Account
              </h1>
              <p className="text-indigo-100 text-center text-sm mt-1">
                Join WriteSpace and start writing today
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
                    htmlFor="displayName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Display Name
                  </label>
                  <input
                    id="displayName"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                    placeholder="Enter your display name"
                  />
                </div>

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
                    placeholder="Choose a username"
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
                    placeholder="Create a password"
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                    placeholder="Confirm your password"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium transition-colors cursor-pointer mt-2"
                >
                  Register
                </button>
              </form>

              <p className="text-center text-sm text-gray-600 mt-6">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                >
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}