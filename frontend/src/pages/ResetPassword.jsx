"use client"

import { useFormik } from "formik"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { Lock, ArrowLeft, Check, Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { resetPasswordSchema } from "../utils/validation"
import toast from "react-hot-toast"

const ResetPassword = () => {
  const { resetPassword } = useAuth()
  const { token } = useParams()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [resetSuccess, setResetSuccess] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: resetPasswordSchema,
    onSubmit: async (values) => {
      try {
        const success = await resetPassword(token, values.password)
        if (success) {
          setResetSuccess(true)
          toast.success("Mot de passe réinitialisé avec succès")
          // Redirect to login after a delay
          setTimeout(() => {
            navigate("/login")
          }, 3000)
        }
      } catch (error) {
        console.error("Reset password error:", error)
        toast.error(error.response?.data?.message || "Erreur lors de la réinitialisation du mot de passe")
      }
    },
  })

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

  if (resetSuccess) {
    return (
      <div className="max-w-md mx-auto card p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
            <Check className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold">Mot de passe réinitialisé!</h1>
          <p className="text-gray-600 mt-4">Votre mot de passe a été réinitialisé avec succès.</p>
          <p className="text-gray-500 mt-2">Vous allez être redirigé vers la page de connexion...</p>
        </div>

        <Link to="/login" className="w-full btn btn-primary flex items-center justify-center">
          Aller à la connexion
        </Link>
      </div>
    )
  }

  if (!token) {
    return (
      <div className="max-w-md mx-auto card p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-4">
            <Lock className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold">Lien invalide</h1>
          <p className="text-gray-600 mt-4">Le lien de réinitialisation du mot de passe est invalide ou a expiré.</p>
        </div>

        <Link to="/forgot-password" className="w-full btn btn-primary flex items-center justify-center">
          Demander un nouveau lien
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto card p-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 text-primary-600 mb-4">
          <Lock className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold">Réinitialiser le mot de passe</h1>
        <p className="text-gray-500 mt-2">Créez un nouveau mot de passe pour votre compte</p>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
            Nouveau mot de passe
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
              placeholder="Créez un nouveau mot de passe"
              {...formik.getFieldProps("password")}
              onChange={handlePasswordChange}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
            </button>
          </div>

          {/* Password strength indicator - only show if password has some value */}
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
              placeholder="Confirmez votre nouveau mot de passe"
              {...formik.getFieldProps("confirmPassword")}
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

        <button
          type="submit"
          className="w-full btn btn-primary flex items-center justify-center py-2.5"
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? (
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
          ) : (
            <>
              <Lock className="h-5 w-5 mr-2" />
              Réinitialiser le mot de passe
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          <Link
            to="/login"
            className="text-primary-600 hover:text-primary-700 font-medium flex items-center justify-center"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Retour à la connexion
          </Link>
        </p>
      </div>
    </div>
  )
}

export default ResetPassword
