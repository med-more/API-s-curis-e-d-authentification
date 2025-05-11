import { createContext, useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import api from "../services/api"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      fetchUserData()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchUserData = async () => {
    try {
      const storedUserData = localStorage.getItem("userData")

      if (storedUserData) {
        const userData = JSON.parse(storedUserData)
        setUser(userData)
      } else {
        const response = await api.get("/auth/me/jwt")

        const role = localStorage.getItem("userRole") || "user"

        const userData = {
          ...response.data,
          role: role,
        }

        localStorage.setItem("userData", JSON.stringify(userData))
        setUser(userData)
      }
    } catch (error) {
      localStorage.removeItem("token")
      localStorage.removeItem("userRole")
      localStorage.removeItem("userData")
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials) => {
    try {
      const response = await api.post("/auth/login", credentials)
      const { token } = response.data

      localStorage.setItem("token", token)

      const isAdmin = credentials.email.includes("admin")
      const role = isAdmin ? "admin" : "user"
      localStorage.setItem("userRole", role)

      const userData = {
        name: credentials.email.split("@")[0], 
        email: credentials.email,
        role: role,
      }

      localStorage.setItem("userData", JSON.stringify(userData))
      setUser(userData)

      toast.success("Login successful!")

      navigate(role === "admin" ? "/admin" : "/user")
      return true
    } catch (error) {
      toast.error(error.response?.data?.error || "Login failed")
      return false
    }
  }

  const register = async (userData) => {
    try {
      await api.post("/auth/register", userData)
      toast.success("Registration successful! Please login.")
      navigate("/login")
      return true
    } catch (error) {
      toast.error(error.response?.data?.error || "Registration failed")
      return false
    }
  }

  const logout = async () => {
    try {
      await api.get("/auth/logout")
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      localStorage.removeItem("token")
      localStorage.removeItem("userRole")
      localStorage.removeItem("userData")
      setUser(null)
      toast.success("Logged out successfully")
      navigate("/login")
    }
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
