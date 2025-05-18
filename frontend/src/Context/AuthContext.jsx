import { createContext, useContext, useState, useEffect } from "react"
import axios from 'axios';
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { authApi } from "../services/api"

// Create context
const AuthContext = createContext()

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authChecked, setAuthChecked] = useState(false)
  const navigate = useNavigate()

  // Check if the user is authenticated on initial load
  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem("token")
      if (token) {
        try {
          await fetchUserData()
        } catch (error) {
          console.error("Auth verification failed:", error)
          clearUserData()
        }
      }
      setLoading(false)
      setAuthChecked(true)
    }

    verifyAuth()
  }, [])

  // Clear user data from storage
  const clearUserData = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userRole")
    localStorage.removeItem("userData")
    setUser(null)
  }

  // Fetch user data from API or localStorage
  const fetchUserData = async () => {
    try {
      // Try to get user data from API first
      const response = await authApi.me()

      // Get user role from localStorage or default to "user"
      const role = localStorage.getItem("userRole") || "user"

      const userData = {
        id: response.data.id || response.data._id,
        name: response.data.name,
        email: response.data.email,
        phone: response.data.phone,
        role: response.data.role || role,
        emailVerified: response.data.emailVerified,
        phoneVerified: response.data.phoneVerified,
        createdAt: response.data.createdAt,
        updatedAt: response.data.updatedAt,
      }

      localStorage.setItem("userData", JSON.stringify(userData))
      localStorage.setItem("userRole", userData.role)
      setUser(userData)
      return userData
    } catch (error) {
      // If API call fails, try to use cached data
      const storedUserData = localStorage.getItem("userData")
      if (storedUserData) {
        const userData = JSON.parse(storedUserData)
        setUser(userData)
        return userData
      }
      throw error
    }
  }

  // Login function
  const login = async (credentials) => {
    try {
      const response = await authApi.login(credentials)
      const { token } = response.data

      // Save token
      localStorage.setItem("token", token)

      // For demo purposes only - in a real app, this would come from the JWT payload
      const isAdmin = credentials.email.includes("admin")
      const role = isAdmin ? "admin" : "user"
      localStorage.setItem("userRole", role)

      // Fetch user data and set user state
      await fetchUserData()

      toast.success("Connexion réussie !")

      // Redirect based on role
      navigate(role === "admin" ? "/admin" : "/user")
      return true
    } catch (error) {
      toast.error(error.response?.data?.message || "Échec de la connexion")
      return false
    }
  }

  // Register function
  const register = async (userData) => {
    try {
      const response = await authApi.register(userData)

      if (response.data.requiresEmailVerification) {
        toast.success("Inscription réussie ! Veuillez vérifier votre email pour confirmer votre compte.")
        // Store email for resend verification
        localStorage.setItem("pendingVerificationEmail", userData.email)
        navigate("/verify-email")
      } else {
        toast.success("Inscription réussie ! Vous pouvez maintenant vous connecter.")
        navigate("/login")
      }
      return true
    } catch (error) {
      console.error('Erreur complète:', error);
      console.error('Réponse du serveur:', error.response?.data);
      
      // Afficher les erreurs de validation si présentes
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach(err => {
          toast.error(`${err.msg}`);
        });
      } else {
        toast.error(error.response?.data?.message || "Échec de l'inscription");
      }
      return false
    }
  }

  // Logout function
  const logout = async () => {
    try {
      await authApi.logout()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      clearUserData()
      toast.success("Déconnexion réussie")
      navigate("/login")
    }
  }

  // Forgot password function
  const forgotPassword = async (email) => {
    try {
      await authApi.forgotPassword(email)
      toast.success("Instructions de réinitialisation du mot de passe envoyées à votre email")
      return true
    } catch (error) {
      toast.error(error.response?.data?.message || "Une erreur est survenue")
      return false
    }
  }

  // Reset password function
  const resetPassword = async (token, password) => {
    try {
      await authApi.resetPassword(token, password)
      toast.success("Mot de passe réinitialisé avec succès. Vous pouvez maintenant vous connecter.")
      navigate("/login")
      return true
    } catch (error) {
      toast.error(error.response?.data?.message || "Échec de la réinitialisation du mot de passe")
      return false
    }
  }

  // Verify email function
  const verifyEmail = async (token) => {
    try {
      await authApi.verifyEmail(token)
      toast.success("Email vérifié avec succès. Vous pouvez maintenant vous connecter.")
      // Remove pending verification email
      localStorage.removeItem("pendingVerificationEmail")

      // If user is already logged in, update the user data
      if (user) {
        await fetchUserData()
      }

      return true
    } catch (error) {
      toast.error(error.response?.data?.message || "Échec de la vérification de l'email")
      return false
    }
  }

  // Resend verification email
  const resendVerification = async (email) => {
    try {
      await authApi.resendVerification(email)
      toast.success("Email de vérification renvoyé. Veuillez vérifier votre boîte de réception.")
      return true
    } catch (error) {
      toast.error(error.response?.data?.message || "Échec de l'envoi de l'email de vérification")
      return false
    }
  }

  // Verify phone function
  const verifyPhone = async (code, phone) => {
    try {
      await authApi.verifyPhone(code, phone)
      toast.success("Numéro de téléphone vérifié avec succès")

      // Update user data
      if (user) {
        await fetchUserData()
      }

      return true
    } catch (error) {
      toast.error(error.response?.data?.message || "Échec de la vérification du numéro de téléphone")
      return false
    }
  }

  // Update profile function
  const updateProfile = async (updateData) => {
    try {
      const response = await authApi.updateProfile(updateData);
      
      // Update user data in context
      await fetchUserData();
      
      toast.success("Profil mis à jour avec succès");
      return true;
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(error.response?.data?.message || "Erreur lors de la mise à jour du profil");
      throw error;
    }
  };

  // Provide all auth functions and state
  const value = {
    user,
    loading,
    authChecked,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendVerification,
    verifyPhone,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}