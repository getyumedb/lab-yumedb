"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface CustomList {
  id: string
  name: string
  color: string
  icon: string
  description: string
  createdAt: string
}

export interface UserData {
  name: string
  email: string
  username: string
  avatar: string | null
  banner: string | null
  bio: string
  location: string
  titleLanguage: "romaji" | "english" | "native"
  customLists: CustomList[]
}

interface AuthContextType {
  user: UserData | null
  isAuthenticated: boolean
  hydrated: boolean
  login: (email: string, password: string) => { success: boolean; error?: string }
  register: (name: string, email: string, password: string) => { success: boolean; error?: string }
  logout: () => void
  updateUser: (data: Partial<UserData>) => void
  addCustomList: (list: Omit<CustomList, "id" | "createdAt">) => void
  updateCustomList: (id: string, data: Partial<CustomList>) => void
  removeCustomList: (id: string) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

const DEMO_CREDENTIALS = {
  email: "demo@yumedb.com",
  password: "demo1234",
}

const DEFAULT_USER: UserData = {
  name: "Demo User",
  email: "demo@yumedb.com",
  username: "demouser",
  avatar: null,
  banner: null,
  bio: "Anime enthusiast and manga collector.",
  location: "Tokyo, Japan",
  titleLanguage: "romaji",
  customLists: [
    { id: "re-watch", name: "Para re-ver", color: "#f59e0b", icon: "repeat", description: "Anime que quiero volver a ver", createdAt: "2026-01-10" },
    { id: "top-10", name: "Mi Top 10", color: "#ef4444", icon: "trophy", description: "Mis 10 anime favoritos de todos los tiempos", createdAt: "2026-01-15" },
  ],
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null)
  const [hydrated, setHydrated] = useState(false)

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("yumedb_user")
      if (stored) {
        setUser(JSON.parse(stored))
      }
    } catch {
      // ignore
    }
    setHydrated(true)
  }, [])

  // Persist to localStorage on change
  useEffect(() => {
    if (!hydrated) return
    if (user) {
      localStorage.setItem("yumedb_user", JSON.stringify(user))
    } else {
      localStorage.removeItem("yumedb_user")
    }
  }, [user, hydrated])

  function login(email: string, password: string) {
    if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
      setUser(DEFAULT_USER)
      return { success: true }
    }
    return { success: false, error: "Credenciales incorrectas. Usa demo@yumedb.com / demo1234" }
  }

  function register(name: string, email: string, _password: string) {
    const newUser: UserData = {
      name,
      email,
      username: name.toLowerCase().replace(/\s+/g, ""),
      avatar: null,
      banner: null,
      bio: "",
      location: "",
      titleLanguage: "romaji",
      customLists: [],
    }
    setUser(newUser)
    return { success: true }
  }

  function logout() {
    setUser(null)
  }

  function updateUser(data: Partial<UserData>) {
    setUser((prev) => (prev ? { ...prev, ...data } : null))
  }

  function addCustomList(list: Omit<CustomList, "id" | "createdAt">) {
    setUser((prev) => {
      if (!prev) return null
      const newList: CustomList = {
        ...list,
        id: list.name.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now(),
        createdAt: new Date().toISOString().slice(0, 10),
      }
      return { ...prev, customLists: [...(prev.customLists || []), newList] }
    })
  }

  function updateCustomList(id: string, data: Partial<CustomList>) {
    setUser((prev) => {
      if (!prev) return null
      return {
        ...prev,
        customLists: (prev.customLists || []).map((l) => (l.id === id ? { ...l, ...data } : l)),
      }
    })
  }

  function removeCustomList(id: string) {
    setUser((prev) => {
      if (!prev) return null
      return { ...prev, customLists: (prev.customLists || []).filter((l) => l.id !== id) }
    })
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        hydrated,
        login,
        register,
        logout,
        updateUser,
        addCustomList,
        updateCustomList,
        removeCustomList,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
  return ctx
}
