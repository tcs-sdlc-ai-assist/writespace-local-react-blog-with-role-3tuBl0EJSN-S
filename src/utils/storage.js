const USERS_KEY = 'ws_users'
const POSTS_KEY = 'ws_posts'
const SESSION_KEY = 'ws_session'

export function getUsers() {
  try {
    const data = localStorage.getItem(USERS_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function setUsers(users) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
  } catch {
    // silently fail
  }
}

export function getPosts() {
  try {
    const data = localStorage.getItem(POSTS_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function setPosts(posts) {
  try {
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts))
  } catch {
    // silently fail
  }
}

export function getSession() {
  try {
    const data = localStorage.getItem(SESSION_KEY)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

export function setSession(session) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  } catch {
    // silently fail
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY)
  } catch {
    // silently fail
  }
}