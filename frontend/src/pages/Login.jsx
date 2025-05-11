import { useFormik } from "formik"
import * as Yup from "yup"
import { Link, Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { Mail, Lock, LogIn } from "lucide-react"
import { useState, useEffect } from "react"

const Login = () => {
  const { login, user } = useAuth()
  const [isLoggedIn, setIsLoggedIn] = useState(false) 
  const [shouldRedirect, setShouldRedirect] = useState(false)

  useEffect(() => {
    if (user) {
      setIsLoggedIn(true)
      setShouldRedirect(true)
    }
  }, [user])

  if (shouldRedirect) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/user"} replace />
  }

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Email is required"),
      password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    }),
    onSubmit: async (values) => {
      await login(values)
    },
  })

  return (
    <div className="max-w-md mx-auto card p-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 text-primary-600 mb-4">
          <LogIn className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold">Welcome Back</h1>
        <p className="text-gray-500 mt-2">Sign in to your account</p>
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
              placeholder="Enter your email"
              {...formik.getFieldProps("email")}
            />
          </div>
          {formik.touched.email && formik.errors.email && <div className="form-error">{formik.errors.email}</div>}
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="password" className="block text-gray-700 font-medium">
              Password
            </label>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password"
              name="password"
              type="password"
              className={`form-input pl-10 ${
                formik.touched.password && formik.errors.password ? "border-red-500" : ""
              }`}
              placeholder="Enter your password"
              {...formik.getFieldProps("password")}
            />
          </div>
          {formik.touched.password && formik.errors.password && (
            <div className="form-error">{formik.errors.password}</div>
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
              <LogIn className="h-5 w-5 mr-2" />
              Sign in
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
            Create account
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
