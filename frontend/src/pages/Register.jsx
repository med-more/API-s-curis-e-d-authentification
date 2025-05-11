import { useFormik } from "formik"
import * as Yup from "yup"
import { Link, Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { User, Mail, Lock, UserPlus } from "lucide-react"
import { useState } from "react"

const Register = () => {
  const { register, user } = useAuth()
  const [isRegistered, setIsRegistered] = useState(false)

  if (user) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/user"} replace />
  }

  const initialValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  }

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
  })

  const onSubmit = async (values) => {
    const { confirmPassword, ...userData } = values
    try {
      const response = await register(userData)
      if (response) {
        setIsRegistered(true)
      }
    } catch (error) {
      console.error("Registration failed:", error)
    }
  }

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  })

  return (
    <div className="max-w-md mx-auto card p-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary-100 text-secondary-600 mb-4">
          <UserPlus className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold">Create Account</h1>
        <p className="text-gray-500 mt-2">Sign up to get started</p>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
            Name
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
              placeholder="Enter your name"
              {...formik.getFieldProps("name")}
            />
          </div>
          {formik.touched.name && formik.errors.name && <div className="form-error">{formik.errors.name}</div>}
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
              placeholder="Enter your email"
              {...formik.getFieldProps("email")}
            />
          </div>
          {formik.touched.email && formik.errors.email && <div className="form-error">{formik.errors.email}</div>}
        </div>

        <div>
          <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
            Password
          </label>
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

        <div>
          <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              className={`form-input pl-10 ${
                formik.touched.confirmPassword && formik.errors.confirmPassword ? "border-red-500" : ""
              }`}
              placeholder="Confirm your password"
              {...formik.getFieldProps("confirmPassword")}
            />
          </div>
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <div className="form-error">{formik.errors.confirmPassword}</div>
          )}
        </div>

        <button
          type="submit"
          className="w-full btn btn-secondary flex items-center justify-center py-2.5"
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? (
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
          ) : (
            <>
              <UserPlus className="h-5 w-5 mr-2" />
              Create Account
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-secondary-600 hover:text-secondary-700 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register
