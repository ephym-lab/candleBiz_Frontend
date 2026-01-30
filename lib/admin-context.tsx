"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface AdminContextType {
  isAuthenticated: boolean
  login: (password: string) => boolean
  logout: () => void
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check if admin is authenticated from localStorage
    const auth = localStorage.getItem("admin_authenticated")
    if (auth === "true") {
      setIsAuthenticated(true)
    }
  }, [])

  const login = (password: string) => {
    // Simple password check - in production, use proper authentication
    if (password === "admin123") {
      setIsAuthenticated(true)
      localStorage.setItem("admin_authenticated", "true")
      return true
    }
    return false
  }

  const logout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem("admin_authenticated")
  }

  return <AdminContext.Provider value={{ isAuthenticated, login, logout }}>{children}</AdminContext.Provider>
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider")
  }
  return context
}
