'use client'

import { useState, useEffect, useCallback } from 'react'

export type CartItem = {
  productId: string
  name: string
  unit: string
  price: number
  quantity: number
}

const STORAGE_KEY = 'distribuidora_cart'

function readCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  } catch {
    return []
  }
}

function saveCart(items: CartItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    setItems(readCart())
  }, [])

  const addItem = useCallback((item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId)
      let next: CartItem[]
      if (existing) {
        next = prev.map((i) => i.productId === item.productId ? { ...i, quantity: i.quantity + (item.quantity ?? 1) } : i)
      } else {
        next = [...prev, { ...item, quantity: item.quantity ?? 1 }]
      }
      saveCart(next)
      return next
    })
  }, [])

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => {
      const next = prev.filter((i) => i.productId !== productId)
      saveCart(next)
      return next
    })
  }, [])

  const updateQty = useCallback((productId: string, quantity: number) => {
    if (quantity < 1) return
    setItems((prev) => {
      const next = prev.map((i) => i.productId === productId ? { ...i, quantity } : i)
      saveCart(next)
      return next
    })
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
    saveCart([])
  }, [])

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return { items, addItem, removeItem, updateQty, clearCart, total }
}
