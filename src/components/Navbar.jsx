import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getCurrentUser, logout } from '../utils/session'
import Avatar from './Avatar'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const user = getCurrentUser()

  function handleLogout() {
    logout()
    setMenuOpen(false)
    navigate('/')
  }

  function handleMenuToggle() {
    setMenuOpen((prev) => !prev)
  }

  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            onClick={closeMenu}
            className="text-xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            WriteSpace
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link
                  to="/blogs"
                  className="text-gray-600 hover:text-indigo-600 transition-colors font-medium"
                >
                  Blogs
                </Link>
                <Link
                  to="/write"
                  className="text-gray-600 hover:text-indigo-600 transition-colors font-medium"
                >
                  Write
                </Link>
                {user.role === 'admin' && (
                  <>
                    <Link
                      to="/admin"
                      className="text-gray-600 hover:text-indigo-600 transition-colors font-medium"
                    >
                      Admin Dashboard
                    </Link>
                    <Link
                      to="/admin/users"
                      className="text-gray-600 hover:text-indigo-600 transition-colors font-medium"
                    >
                      Users
                    </Link>
                  </>
                )}
                <div className="flex items-center gap-3 ml-2">
                  <Avatar role={user.role} size="sm" />
                  <span className="text-gray-700 font-medium text-sm">
                    {user.displayName}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-indigo-600 transition-colors font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={handleMenuToggle}
            className="md:hidden flex flex-col items-center justify-center w-10 h-10 gap-1.5 cursor-pointer"
            aria-label="Toggle menu"
          >
            <span
              className={`block w-6 h-0.5 bg-gray-600 transition-transform ${
                menuOpen ? 'rotate-45 translate-y-2' : ''
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-gray-600 transition-opacity ${
                menuOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-gray-600 transition-transform ${
                menuOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
            />
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100">
            <div className="flex flex-col gap-2 pt-4">
              {user ? (
                <>
                  <div className="flex items-center gap-3 px-2 py-2">
                    <Avatar role={user.role} size="sm" />
                    <span className="text-gray-700 font-medium text-sm">
                      {user.displayName}
                    </span>
                  </div>
                  <Link
                    to="/blogs"
                    onClick={closeMenu}
                    className="text-gray-600 hover:text-indigo-600 hover:bg-gray-50 transition-colors font-medium px-2 py-2 rounded-lg"
                  >
                    Blogs
                  </Link>
                  <Link
                    to="/write"
                    onClick={closeMenu}
                    className="text-gray-600 hover:text-indigo-600 hover:bg-gray-50 transition-colors font-medium px-2 py-2 rounded-lg"
                  >
                    Write
                  </Link>
                  {user.role === 'admin' && (
                    <>
                      <Link
                        to="/admin"
                        onClick={closeMenu}
                        className="text-gray-600 hover:text-indigo-600 hover:bg-gray-50 transition-colors font-medium px-2 py-2 rounded-lg"
                      >
                        Admin Dashboard
                      </Link>
                      <Link
                        to="/admin/users"
                        onClick={closeMenu}
                        className="text-gray-600 hover:text-indigo-600 hover:bg-gray-50 transition-colors font-medium px-2 py-2 rounded-lg"
                      >
                        Users
                      </Link>
                    </>
                  )}
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer text-left mt-2"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="text-gray-600 hover:text-indigo-600 hover:bg-gray-50 transition-colors font-medium px-2 py-2 rounded-lg"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors text-center mt-1"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}