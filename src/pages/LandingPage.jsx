import React from 'react'
import { Link } from 'react-router-dom'
import { getCurrentUser } from '../utils/session'
import { getPosts } from '../utils/storage'
import Navbar from '../components/Navbar'

export default function LandingPage() {
  const user = getCurrentUser()
  const posts = getPosts()
  const latestPosts = [...posts]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3)

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">WriteSpace</h1>
          <p className="text-xl text-indigo-100 mb-8">
            Your personal space to write, share, and explore ideas — all stored locally in your browser.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {user ? (
              <Link
                to="/blogs"
                className="bg-white text-indigo-600 hover:bg-indigo-50 px-6 py-3 rounded-lg font-semibold text-lg transition-colors"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="bg-white text-indigo-600 hover:bg-indigo-50 px-6 py-3 rounded-lg font-semibold text-lg transition-colors"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="border-2 border-white text-white hover:bg-white hover:text-indigo-600 px-6 py-3 rounded-lg font-semibold text-lg transition-colors"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Why WriteSpace?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
              <div className="text-4xl mb-4">✏️</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Write Freely
              </h3>
              <p className="text-gray-600">
                Express your thoughts and ideas with a clean, distraction-free writing experience.
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Private & Local
              </h3>
              <p className="text-gray-600">
                All your data stays in your browser. No servers, no tracking, complete privacy.
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Instant & Fast
              </h3>
              <p className="text-gray-600">
                No loading screens or network delays. Everything runs instantly in your browser.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Posts Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Latest Posts
          </h2>
          {latestPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {latestPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {post.content}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>{post.authorName}</span>
                    <span>
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No posts yet. Be the first to write something!
              </p>
              {!user && (
                <Link
                  to="/register"
                  className="inline-block mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Get Started
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-12 px-4 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <span className="text-xl font-bold text-white">WriteSpace</span>
            <p className="text-sm text-gray-400 mt-1">
              © {new Date().getFullYear()} WriteSpace. All rights reserved.
            </p>
          </div>
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              Home
            </Link>
            <Link
              to="/blogs"
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              Blogs
            </Link>
            <Link
              to="/login"
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              Register
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}