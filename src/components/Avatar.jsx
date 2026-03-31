import React from 'react'

const sizeClasses = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg'
}

export default function Avatar({ role, size = 'md' }) {
  const isAdmin = role === 'admin'
  const emoji = isAdmin ? '👑' : '📖'
  const bgClass = isAdmin ? 'bg-violet-500' : 'bg-indigo-500'
  const sizeClass = sizeClasses[size] || sizeClasses.md

  return (
    <div
      className={`${sizeClass} ${bgClass} rounded-full flex items-center justify-center shrink-0`}
    >
      <span>{emoji}</span>
    </div>
  )
}