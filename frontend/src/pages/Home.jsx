import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { Shield, User, ArrowRight, LogIn, UserPlus, Users, Layers } from "lucide-react"

const Home = () => {
  const { user } = useAuth()

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
          Welcome to Auth App
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          A demonstration of role-based authentication with React, Vite, and Tailwind CSS
        </p>
      </div>

      {user ? (
        <div className="card p-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6">
            {user.role === "admin" ? (
              <div className="bg-secondary-100 p-5 rounded-full">
                <Shield className="h-10 w-10 text-secondary-600" />
              </div>
            ) : (
              <div className="bg-primary-100 p-5 rounded-full">
                <User className="h-10 w-10 text-primary-600" />
              </div>
            )}
          </div>
          <h2 className="text-2xl font-semibold mb-4">
            You are logged in as <span className="capitalize">{user.role}</span>
          </h2>
          <p className="text-gray-600 mb-6">
            Access your personalized dashboard to view your information and manage your account.
          </p>
          <Link to="/dashboard" className="btn btn-primary inline-flex items-center px-6 py-3">
            Go to Dashboard
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card p-8 text-center flex flex-col items-center">
            <div className="bg-primary-100 p-5 rounded-full mb-6">
              <User className="h-10 w-10 text-primary-600" />
            </div>
            <h2 className="text-2xl font-semibold mb-4">User Account</h2>
            <p className="text-gray-600 mb-6 flex-grow">
              Sign in to access your personal dashboard and manage your account settings.
            </p>
            <Link to="/login" className="btn btn-primary w-full flex items-center justify-center">
              <LogIn className="mr-2 h-5 w-5" />
              Login
            </Link>
          </div>

          <div className="card p-8 text-center flex flex-col items-center">
            <div className="bg-secondary-100 p-5 rounded-full mb-6">
              <UserPlus className="h-10 w-10 text-secondary-600" />
            </div>
            <h2 className="text-2xl font-semibold mb-4">New Here?</h2>
            <p className="text-gray-600 mb-6 flex-grow">
              Create a new account to get started with our platform and explore all features.
            </p>
            <Link to="/register" className="btn btn-secondary w-full flex items-center justify-center">
              <UserPlus className="mr-2 h-5 w-5" />
              Register
            </Link>
          </div>
        </div>
      )}

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="bg-primary-50 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
            <Shield className="h-6 w-6 text-primary-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Secure Authentication</h3>
          <p className="text-gray-600">Industry-standard JWT authentication to keep your data safe and secure.</p>
        </div>

        <div className="card p-6">
          <div className="bg-secondary-50 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
            <Users className="h-6 w-6 text-secondary-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Role-Based Access</h3>
          <p className="text-gray-600">Different access levels for users and administrators with custom dashboards.</p>
        </div>

        <div className="card p-6">
          <div className="bg-gray-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
            <Layers className="h-6 w-6 text-gray-700" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Modern Stack</h3>
          <p className="text-gray-600">Built with React, Vite, Tailwind CSS, and other modern technologies.</p>
        </div>
      </div>
    </div>
  )
}

export default Home
