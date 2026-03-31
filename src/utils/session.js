import { getUsers, setUsers, getSession, setSession, clearSession } from './storage'

const ADMIN_CREDENTIALS = {
  id: 'admin-001',
  displayName: 'Admin',
  username: 'admin',
  password: 'admin123',
  role: 'admin',
  createdAt: '2024-01-01T00:00:00.000Z'
}

export function login(username, password) {
  if (!username || !password) {
    return { success: false, error: 'All fields are required.' }
  }

  if (
    username.toLowerCase() === ADMIN_CREDENTIALS.username.toLowerCase() &&
    password === ADMIN_CREDENTIALS.password
  ) {
    const session = {
      userId: ADMIN_CREDENTIALS.id,
      username: ADMIN_CREDENTIALS.username,
      role: ADMIN_CREDENTIALS.role
    }
    setSession(session)
    return { success: true, user: { ...ADMIN_CREDENTIALS } }
  }

  const users = getUsers()
  const user = users.find(
    (u) => u.username.toLowerCase() === username.toLowerCase()
  )

  if (!user || user.password !== password) {
    return { success: false, error: 'Invalid username or password.' }
  }

  const session = {
    userId: user.id,
    username: user.username,
    role: user.role
  }
  setSession(session)
  return { success: true, user }
}

export function register({ displayName, username, password, confirmPassword }) {
  if (!displayName || !username || !password || !confirmPassword) {
    return { success: false, error: 'All fields are required.' }
  }

  if (password !== confirmPassword) {
    return { success: false, error: 'Passwords do not match.' }
  }

  if (username.toLowerCase() === ADMIN_CREDENTIALS.username.toLowerCase()) {
    return { success: false, error: 'Username already exists.' }
  }

  const users = getUsers()
  const existing = users.find(
    (u) => u.username.toLowerCase() === username.toLowerCase()
  )

  if (existing) {
    return { success: false, error: 'Username already exists.' }
  }

  const user = {
    id: crypto.randomUUID(),
    displayName,
    username,
    password,
    role: 'viewer',
    createdAt: new Date().toISOString()
  }

  setUsers([...users, user])

  const session = {
    userId: user.id,
    username: user.username,
    role: user.role
  }
  setSession(session)

  return { success: true, user }
}

export function logout() {
  clearSession()
}

export function getCurrentUser() {
  const session = getSession()
  if (!session) {
    return null
  }

  if (session.userId === ADMIN_CREDENTIALS.id) {
    return { ...ADMIN_CREDENTIALS }
  }

  const users = getUsers()
  const user = users.find((u) => u.id === session.userId)
  return user || null
}

export { ADMIN_CREDENTIALS }