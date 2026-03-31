import React from 'react'
import { Navigate } from 'react-router-dom'
import { getCurrentUser } from '../utils/session'

export default function ProtectedRoute({ children, role }) {
  const user = getCurrentUser()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (role && user.role !== role) {
    return <Navigate to="/blogs" replace />
  }

  return children
}