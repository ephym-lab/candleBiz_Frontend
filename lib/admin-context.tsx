"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { adminLogin, logout as apiLogout, isAuthenticated as checkAuth, getStoredUser } from "@/lib/api/services/auth"
import type { User } from "@/lib/api/types"

interface AdminContextType {
  isAuthenticated: boolean
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if admin is authenticated from localStorage
    const authenticated = checkAuth()
    const storedUser = getStoredUser()

    if (authenticated && storedUser) {
      setIsAuthenticated(true)
      setUser(storedUser)
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await adminLogin(email, password)
      setIsAuthenticated(true)
      setUser(response.user)
      return true
    } catch (error) {
      console.error("Login failed:", error)
      return false
    }
  }

  const logout = () => {
    apiLogout()
    setIsAuthenticated(false)
    setUser(null)
  }

  return (
    <AdminContext.Provider value={{ isAuthenticated, user, login, logout, isLoading }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider")
  }
  return context
}
