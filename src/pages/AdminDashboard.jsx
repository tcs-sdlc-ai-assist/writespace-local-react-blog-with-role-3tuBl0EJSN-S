import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getCurrentUser } from '../utils/session'
import { getPosts, setPosts, getUsers } from '../utils/storage'
import Navbar from '../components/Navbar'
import Avatar from '../components/Avatar'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const user = getCurrentUser()

  const [posts, setPostsState] = useState([])
  const [users, setUsersState] = useState([])
  const [showConfirm, setShowConfirm] = useState(null)

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login', { replace: true })
      return
    }

    setPostsState(getPosts())
    setUsersState(getUsers())
  }, [user, navigate])

  const totalPosts = posts.length
  const totalUsers = users.length + 1 // +1 for hard-coded admin
  const adminsCount = 1 + users.filter((u) => u.role === 'admin').length
  const viewersCount = users.filter((u) => u.role === 'viewer').length

  const recentPosts = [...posts]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)

  function handleDelete(postId) {
    const updatedPosts = posts.filter((p) => p.id !== postId)
    setPosts(updatedPosts)
    setPostsState(updatedPosts)
    setShowConfirm(null)
  }

  const stats = [
    {
      label: 'Total Posts',
      value: totalPosts,
      emoji: '📝',
      bgClass: 'bg-indigo-50',
      textClass: 'text-indigo-600'
    },
    {
      label: 'Total Users',
      value: totalUsers,
      emoji: '👥',
      bgClass: 'bg-purple-50',
      textClass: 'text-purple-600'
    },
    {
      label: 'Admins',
      value: adminsCount,
      emoji: '👑',
      bgClass: 'bg-violet-50',
      textClass: 'text-violet-600'
    },
    {
      label: 'Viewers',
      value: viewersCount,
      emoji: '📖',
      bgClass: 'bg-blue-50',
      textClass: 'text-blue-600'
    }
  ]

  const confirmPost = showConfirm
    ? posts.find((p) => p.id === showConfirm)
    : null

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Gradient Banner Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-xl p-8 mb-8">
          <div className="flex items-center gap-4">
            <Avatar role="admin" size="lg" />
            <div>
              <h1 className="text-3xl font-bold text-white">
                Welcome back, {user?.displayName}
              </h1>
              <p className="text-indigo-100 mt-1">
                Here's an overview of your WriteSpace platform.
              </p>
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 ${stat.bgClass} rounded-lg flex items-center justify-center`}
                >
                  <span className="text-2xl">{stat.emoji}</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    {stat.label}
                  </p>
                  <p className={`text-2xl font-bold ${stat.textClass}`}>
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Quick Actions
          </h2>
          <div className="flex items-center gap-4 flex-wrap">
            <Link
              to="/write"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Write New Post
            </Link>
            <Link
              to="/admin/users"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Manage Users
            </Link>
          </div>
        </div>

        {/* Recent Posts */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Recent Posts
          </h2>
          {recentPosts.length > 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="divide-y divide-gray-100">
                {recentPosts.map((post) => (
                  <div
                    key={post.id}
                    className="flex items-center justify-between px-6 py-4 gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/blog/${post.id}`}
                        className="text-gray-800 font-semibold hover:text-indigo-600 transition-colors line-clamp-1"
                      >
                        {post.title}
                      </Link>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm text-gray-400">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-500 font-medium">
                          {post.authorName}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Link
                        to={`/edit/${post.id}`}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => setShowConfirm(post.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">No posts yet.</p>
              <Link
                to="/write"
                className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Write your first post
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showConfirm && confirmPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Delete Post
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{confirmPost.title}"? This action
              cannot be undone.
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleDelete(showConfirm)}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition-colors cursor-pointer"
              >
                Delete
              </button>
              <button
                onClick={() => setShowConfirm(null)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}