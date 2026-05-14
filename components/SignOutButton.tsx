'use client'

import { signOut } from 'next-auth/react'

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/login' })}
      className="text-gray-300 hover:text-white text-sm transition-colors"
    >
      Salir
    </button>
  )
}
