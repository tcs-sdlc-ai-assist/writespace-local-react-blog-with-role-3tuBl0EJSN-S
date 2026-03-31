import React from 'react'
import { Link } from 'react-router-dom'
import { getPosts } from '../utils/storage'
import { getCurrentUser } from '../utils/session'
import Navbar from '../components/Navbar'
import Avatar from '../components/Avatar'

export default function BlogList() {
  const user = getCurrentUser()
  const posts = getPosts()
  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  )

  function canEdit(post) {
    if (!user) return false
    if (user.role === 'admin') return true
    return post.authorId === user.id
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">All Posts</h1>
          <Link
            to="/write"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Write Post
          </Link>
        </div>

        {sortedPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col"
              >
                <Link
                  to={`/blog/${post.id}`}
                  className="flex-1 p-6 flex flex-col"
                >
                  <h2 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {post.content.length > 100
                      ? post.content.slice(0, 100) + '...'
                      : post.content}
                  </p>
                  <div className="mt-auto text-sm text-gray-400">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                </Link>

                <div className="px-6 pb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar
                      role={
                        post.authorId === 'admin-001' ? 'admin' : 'viewer'
                      }
                      size="sm"
                    />
                    <span className="text-gray-700 text-sm font-medium">
                      {post.authorName}
                    </span>
                  </div>

                  {canEdit(post) && (
                    <Link
                      to={`/edit/${post.id}`}
                      className="text-gray-400 hover:text-indigo-600 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                      aria-label="Edit post"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.862 4.487a2.1 2.1 0 1 1 2.97 2.97L7.5 19.79l-4 1 1-4L16.862 4.487z"
                        />
                      </svg>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
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
  )
}