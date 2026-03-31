import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser, ADMIN_CREDENTIALS } from '../utils/session'
import { getUsers, setUsers } from '../utils/storage'
import Navbar from '../components/Navbar'
import Avatar from '../components/Avatar'

export default function UserManagement() {
  const navigate = useNavigate()
  const user = getCurrentUser()

  const [users, setUsersState] = useState([])
  const [displayName, setDisplayName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('viewer')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showConfirm, setShowConfirm] = useState(null)

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login', { replace: true })
      return
    }

    setUsersState(getUsers())
  }, [user, navigate])

  const allUsers = [
    {
      id: ADMIN_CREDENTIALS.id,
      displayName: ADMIN_CREDENTIALS.displayName,
      username: ADMIN_CREDENTIALS.username,
      role: ADMIN_CREDENTIALS.role,
      createdAt: ADMIN_CREDENTIALS.createdAt
    },
    ...users
  ]

  function handleCreateUser(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!displayName.trim() || !username.trim() || !password.trim()) {
      setError('All fields are required.')
      return
    }

    if (username.toLowerCase() === ADMIN_CREDENTIALS.username.toLowerCase()) {
      setError('Username already exists.')
      return
    }

    const existing = users.find(
      (u) => u.username.toLowerCase() === username.trim().toLowerCase()
    )

    if (existing) {
      setError('Username already exists.')
      return
    }

    const newUser = {
      id: crypto.randomUUID(),
      displayName: displayName.trim(),
      username: username.trim(),
      password: password.trim(),
      role,
      createdAt: new Date().toISOString()
    }

    const updatedUsers = [...users, newUser]
    setUsers(updatedUsers)
    setUsersState(updatedUsers)

    setDisplayName('')
    setUsername('')
    setPassword('')
    setRole('viewer')
    setSuccess(`User "${newUser.displayName}" created successfully.`)
  }

  function handleDelete(userId) {
    const updatedUsers = users.filter((u) => u.id !== userId)
    setUsers(updatedUsers)
    setUsersState(updatedUsers)
    setShowConfirm(null)
    setSuccess('User deleted successfully.')
  }

  function canDelete(targetUser) {
    if (targetUser.id === ADMIN_CREDENTIALS.id) return false
    if (user && targetUser.id === user.id) return false
    return true
  }

  const confirmUser = showConfirm
    ? allUsers.find((u) => u.id === showConfirm)
    : null

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          User Management
        </h1>

        {/* Create User Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Create New User
          </h2>

          {error && (
            <div className="mb-4 text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 text-green-600 text-sm text-center">
              {success}
            </div>
          )}

          <form onSubmit={handleCreateUser} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  placeholder="Enter display name"
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
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Role
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                >
                  <option value="viewer">Viewer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors cursor-pointer"
              >
                Create User
              </button>
            </div>
          </form>
        </div>

        {/* Users List */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            All Users ({allUsers.length})
          </h2>

          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                    Avatar
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                    Display Name
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                    Username
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                    Role
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                    Created Date
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {allUsers.map((u) => (
                  <tr key={u.id}>
                    <td className="px-6 py-4">
                      <Avatar role={u.role} size="sm" />
                    </td>
                    <td className="px-6 py-4 text-gray-800 font-medium">
                      {u.displayName}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{u.username}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          u.role === 'admin'
                            ? 'bg-violet-100 text-violet-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {u.role === 'admin' ? 'Admin' : 'Viewer'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {canDelete(u) ? (
                        <button
                          onClick={() => setShowConfirm(u.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                        >
                          Delete
                        </button>
                      ) : (
                        <span className="text-gray-300 text-sm">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden flex flex-col gap-4">
            {allUsers.map((u) => (
              <div
                key={u.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Avatar role={u.role} size="md" />
                  <div>
                    <p className="text-gray-800 font-semibold">
                      {u.displayName}
                    </p>
                    <p className="text-gray-500 text-sm">@{u.username}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      u.role === 'admin'
                        ? 'bg-violet-100 text-violet-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {u.role === 'admin' ? 'Admin' : 'Viewer'}
                  </span>
                  <span className="text-gray-400 text-sm">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {canDelete(u) && (
                  <button
                    onClick={() => setShowConfirm(u.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer w-full mt-2"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showConfirm && confirmUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Delete User
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{confirmUser.displayName}"? This
              action cannot be undone.
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