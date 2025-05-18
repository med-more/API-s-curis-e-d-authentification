import axios from "axios"
import toast from "react-hot-toast"

// Create axios instance with default config
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // Important for cookies/session support
  timeout: 10000, // 10 seconds timeout
})

// Add a request interceptor to add the JWT token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    // Handle request error
    console.error("API request error:", error)
    return Promise.reject(error)
  },
)

// Add a response interceptor to handle authentication errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors globally
    if (error.response && error.response.status === 401) {
      // Clear user data and token
      localStorage.removeItem("token")
      localStorage.removeItem("userRole")
      localStorage.removeItem("userData")

      // Show notification
      toast.error("Session expired. Please login again.")

      // Redirect to login page
      setTimeout(() => {
        window.location.href = "/login"
      }, 500)
    }

    // Handle 403 Forbidden errors
    if (error.response && error.response.status === 403) {
      toast.error("You don't have permission to access this resource.")
    }

    // Handle network errors
    if (error.code === "ECONNABORTED" || !error.response) {
      toast.error("Network error. Please check your connection.")
    }

    return Promise.reject(error)
  },
)

// Auth API endpoints
export const authApi = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
  logout: () => api.get("/auth/logout"),
  me: () => api.get("/auth/me/jwt"),
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),
  resetPassword: (token, password) => api.post(`/auth/reset-password/${token}`, { password }),
  verifyEmail: (token) => api.get(`/auth/verify-email/${token}`),
  resendVerification: (email) => api.post("/auth/resend-verification", { email }),
  verifyPhone: (code, phone) => api.post("/auth/verify-phone", { code, phone }),
  updateProfile: (userData) => api.put("/auth/profile", userData),
}

// User API endpoints
export const userApi = {
  getAllUsers: (page = 1, limit = 10) => api.get(`/users?page=${page}&limit=${limit}`),
  searchUsers: (query) => api.get(`/users/search?q=${query}`),
  getUserById: (id) => api.get(`/users/${id}`),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
  getActivityLogs: () => api.get("/users/activity-logs"),
}

export default api
