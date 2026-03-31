import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getCurrentUser } from '../utils/session'
import { getPosts, setPosts } from '../utils/storage'
import Navbar from '../components/Navbar'

export default function WriteBlog() {
  const { id } = useParams()
  const navigate = useNavigate()
  const user = getCurrentUser()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [error, setError] = useState('')

  const isEditMode = Boolean(id)

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true })
      return
    }

    if (isEditMode) {
      const posts = getPosts()
      const post = posts.find((p) => p.id === id)

      if (!post) {
        navigate('/blogs', { replace: true })
        return
      }

      const canEdit =
        user.role === 'admin' || post.authorId === user.id

      if (!canEdit) {
        navigate('/blogs', { replace: true })
        return
      }

      setTitle(post.title)
      setContent(post.content)
    }
  }, [id, isEditMode, navigate, user])

  function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!title.trim() || !content.trim()) {
      setError('Title and content are required.')
      return
    }

    const posts = getPosts()

    if (isEditMode) {
      const updatedPosts = posts.map((post) => {
        if (post.id === id) {
          return {
            ...post,
            title: title.trim(),
            content: content.trim(),
            updatedAt: new Date().toISOString()
          }
        }
        return post
      })
      setPosts(updatedPosts)
    } else {
      const newPost = {
        id: crypto.randomUUID(),
        title: title.trim(),
        content: content.trim(),
        authorId: user.id,
        authorName: user.displayName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setPosts([...posts, newPost])
    }

    navigate('/blogs')
  }

  function handleCancel() {
    navigate('/blogs')
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          {isEditMode ? 'Edit Post' : 'Write a New Post'}
        </h1>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          {error && (
            <div className="mb-4 text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                placeholder="Enter your post title"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-gray-700"
                >
                  Content
                </label>
                <span className="text-sm text-gray-400">
                  {content.length} characters
                </span>
              </div>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={12}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors resize-y"
                placeholder="Write your content here..."
              />
            </div>

            <div className="flex items-center gap-4 mt-2">
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors cursor-pointer"
              >
                {isEditMode ? 'Update Post' : 'Publish Post'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}