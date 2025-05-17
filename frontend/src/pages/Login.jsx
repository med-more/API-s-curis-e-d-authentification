"use client"

import { useFormik } from "formik"
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { Mail, Lock, LogIn, Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { loginSchema } from "../utils/validation"

const Login = () => {
  const { login, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [showPassword, setShowPassword] = useState(false)

  // Get the return path from location state or default to dashboard
  const from = location.state?.from || "/dashboard"

  // Redirect if user is already logged in
  if (user) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/user"} replace />
  }

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      const success = await login(values)
      if (success) {
        // If login was successful, redirect to the original destination
        navigate(from, { replace: true })
      }
    },
  })

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  return (
    <div className="max-w-md mx-auto card p-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 text-primary-600 mb-4">
          <LogIn className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold">Bienvenue</h1>
        <p className="text-gray-500 mt-2">Connectez-vous à votre compte</p>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-5">
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
              {...formik.getFieldProps("email")}
            />
          </div>
          {formik.touched.email && formik.errors.email && <div className="form-error">{formik.errors.email}</div>}
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="password" className="block text-gray-700 font-medium">
              Mot de passe
            </label>
            <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700">
              Mot de passe oublié?
            </Link>
          </div>
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
              placeholder="Entrez votre mot de passe"
              {...formik.getFieldProps("password")}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
            </button>
          </div>
          {formik.touched.password && formik.errors.password && (
            <div className="form-error">{formik.errors.password}</div>
          )}
        </div>

        <div className="flex items-center">
          <input
            id="rememberMe"
            name="rememberMe"
            type="checkbox"
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            {...formik.getFieldProps("rememberMe")}
          />
          <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
            Se souvenir de moi
          </label>
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
              <LogIn className="h-5 w-5 mr-2" />
              Se connecter
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Vous n'avez pas de compte?{" "}
          <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
