import axios from "axios"

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api",
  timeout: 15_000,
  headers: { "Content-Type": "application/json" },
})

// ─── Request interceptor ─────────────────────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    // Attach auth token when available
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token")
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error),
)

// ─── Response interceptor ────────────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response
      if (status === 401) {
        // Token expired or invalid - clear and redirect
        if (typeof window !== "undefined") {
          localStorage.removeItem("auth_token")
          // Could redirect to login: window.location.href = "/login"
        }
      }
      if (status === 403) {
        console.error("[API] Forbidden:", error.response.data)
      }
      if (status >= 500) {
        console.error("[API] Server error:", error.response.data)
      }
    } else if (error.request) {
      console.error("[API] Network error - no response received")
    }
    return Promise.reject(error)
  },
)

export default apiClient
