"use client"

import { useFormik } from "formik"
import { Link, Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { User, Mail, Lock, UserPlus, Phone, Eye, EyeOff, Info } from "lucide-react"
import { useState } from "react"
import { registerSchema } from "../utils/validation"

const Register = () => {
  const { register, user } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)

  const initialValues = {
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  }

  const formik = useFormik({
    initialValues,
    validationSchema: registerSchema,
    onSubmit: async (values, { setSubmitting }) => {
      // Prepare data for API by removing confirmPassword and acceptTerms
      const { confirmPassword, acceptTerms, ...userData } = values
      
      try {
        const success = await register(userData)
        if (!success) {
          // Reset form if registration fails
          formik.resetForm()
        }
      } catch (error) {
        console.error("Registration failed:", error)
      } finally {
        setSubmitting(false)
      }
    },
  })

  // Redirect if user is already logged in
  if (user) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/user"} replace />
  }

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev)
  }

  // Check password strength
  const checkPasswordStrength = (password) => {
    let score = 0

    // Length check
    if (password.length >= 8) score += 1

    // Complexity checks
    if (/[A-Z]/.test(password)) score += 1
    if (/[a-z]/.test(password)) score += 1
    if (/[0-9]/.test(password)) score += 1
    if (/[^A-Za-z0-9]/.test(password)) score += 1

    setPasswordStrength(score)
  }

  // Update password strength when password changes
  const handlePasswordChange = (e) => {
    const { value } = e.target
    formik.handleChange(e)
    checkPasswordStrength(value)
  }

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return "bg-red-500"
    if (passwordStrength <= 3) return "bg-yellow-500"
    return "bg-green-500"
  }

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 2) return "Faible"
    if (passwordStrength <= 3) return "Moyen"
    return "Fort"
  }

  return (
    <div className="max-w-md mx-auto card p-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary-100 text-secondary-600 mb-4">
          <UserPlus className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold">Créer un compte</h1>
        <p className="text-gray-500 mt-2">Inscrivez-vous pour commencer</p>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
            Nom complet
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="name"
              name="name"
              type="text"
              className={`form-input pl-10 ${formik.touched.name && formik.errors.name ? "border-red-500" : ""}`}
              placeholder="Entrez votre nom complet"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          {formik.touched.name && formik.errors.name && (
            <div className="form-error">{formik.errors.name}</div>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              className={`form-input pl-10 ${formik.touched.email && formik.errors.email ? "border-red-500" : ""}`}
              placeholder="Entrez votre email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          {formik.touched.email && formik.errors.email && (
            <div className="form-error">{formik.errors.email}</div>
          )}
          <p className="text-xs text-gray-500 mt-1 flex items-center">
            <Info className="h-3 w-3 mr-1" />
            Vous recevrez un email de confirmation
          </p>
        </div>

        <div>
          <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">
            Téléphone
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="phone"
              name="phone"
              type="tel"
              className={`form-input pl-10 ${formik.touched.phone && formik.errors.phone ? "border-red-500" : ""}`}
              placeholder="Entrez votre numéro de téléphone"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          {formik.touched.phone && formik.errors.phone && (
            <div className="form-error">{formik.errors.phone}</div>
          )}
          <p className="text-xs text-gray-500 mt-1 flex items-center">
            <Info className="h-3 w-3 mr-1" />
            Format: +33612345678
          </p>
        </div>

        <div>
          <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
            Mot de passe
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              className={`form-input pl-10 pr-10 ${
                formik.touched.password && formik.errors.password ? "border-red-500" : ""
              }`}
              placeholder="Créez un mot de passe"
              value={formik.values.password}
              onChange={handlePasswordChange}
              onBlur={formik.handleBlur}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
            </button>
          </div>

          {/* Password strength indicator */}
          {formik.values.password && (
            <div className="mt-1">
              <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${getPasswordStrengthColor()}`}
                  style={{ width: `${(passwordStrength / 5) * 100}%` }}
                ></div>
              </div>
              <p
                className={`text-xs mt-1 ${
                  passwordStrength <= 2 ? "text-red-500" : passwordStrength <= 3 ? "text-yellow-500" : "text-green-500"
                }`}
              >
                {getPasswordStrengthText()}
              </p>
            </div>
          )}

          {formik.touched.password && formik.errors.password && (
            <div className="form-error">{formik.errors.password}</div>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">
            Confirmer le mot de passe
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              className={`form-input pl-10 pr-10 ${
                formik.touched.confirmPassword && formik.errors.confirmPassword ? "border-red-500" : ""
              }`}
              placeholder="Confirmez votre mot de passe"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={toggleConfirmPasswordVisibility}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <div className="form-error">{formik.errors.confirmPassword}</div>
          )}
        </div>

        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="acceptTerms"
              name="acceptTerms"
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              checked={formik.values.acceptTerms}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="acceptTerms" className="text-gray-700">
              J'accepte les{" "}
              <Link to="/terms" className="text-primary-600 hover:text-primary-700 font-medium">
                conditions d'utilisation
              </Link>{" "}
              et la{" "}
              <Link to="/privacy" className="text-primary-600 hover:text-primary-700 font-medium">
                politique de confidentialité
              </Link>
            </label>
            {formik.touched.acceptTerms && formik.errors.acceptTerms && (
              <div className="form-error">{formik.errors.acceptTerms}</div>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full btn btn-secondary flex items-center justify-center py-2.5"
          disabled={formik.isSubmitting || !formik.isValid}
        >
          {formik.isSubmitting ? (
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
          ) : (
            <>
              <UserPlus className="h-5 w-5 mr-2" />
              Créer un compte
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Vous avez déjà un compte?{" "}
          <Link to="/login" className="text-secondary-600 hover:text-secondary-700 font-medium">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register