import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getCurrentUser } from '../utils/session'
import { getPosts, setPosts } from '../utils/storage'
import Navbar from '../components/Navbar'
import Avatar from '../components/Avatar'

export default function ReadBlog() {
  const { id } = useParams()
  const navigate = useNavigate()
  const user = getCurrentUser()

  const [post, setPost] = useState(null)
  const [notFound, setNotFound] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    const posts = getPosts()
    const found = posts.find((p) => p.id === id)

    if (found) {
      setPost(found)
    } else {
      setNotFound(true)
    }
  }, [id])

  function canEditOrDelete() {
    if (!user) return false
    if (user.role === 'admin') return true
    return post && post.authorId === user.id
  }

  function handleDelete() {
    const posts = getPosts()
    const updatedPosts = posts.filter((p) => p.id !== id)
    setPosts(updatedPosts)
    navigate('/blogs')
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />

        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Post not found
            </h1>
            <p className="text-gray-500 text-lg mb-6">
              The post you're looking for doesn't exist or has been removed.
            </p>
            <Link
              to="/blogs"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Back to Blogs
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500 text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {post.title}
          </h1>

          <div className="flex items-center gap-3 mb-6">
            <Avatar
              role={post.authorId === 'admin-001' ? 'admin' : 'viewer'}
              size="md"
            />
            <div>
              <span className="text-gray-700 font-medium block">
                {post.authorName}
              </span>
              <span className="text-gray-400 text-sm">
                {new Date(post.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
                {post.updatedAt && post.updatedAt !== post.createdAt && (
                  <span className="ml-2 text-gray-300">
                    (edited{' '}
                    {new Date(post.updatedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                    )
                  </span>
                )}
              </span>
            </div>
          </div>

          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {post.content}
            </p>
          </div>

          {canEditOrDelete() && (
            <div className="flex items-center gap-4 mt-8 pt-6 border-t border-gray-100">
              <Link
                to={`/edit/${post.id}`}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Edit Post
              </Link>
              <button
                onClick={() => setShowConfirm(true)}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition-colors cursor-pointer"
              >
                Delete Post
              </button>
            </div>
          )}
        </div>

        <div className="mt-6">
          <Link
            to="/blogs"
            className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
          >
            ← Back to Blogs
          </Link>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Delete Post
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{post.title}"? This action cannot
              be undone.
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition-colors cursor-pointer"
              >
                Delete
              </button>
              <button
                onClick={() => setShowConfirm(false)}
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