import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { LogOut, User, Shield } from "lucide-react"

const Navbar = () => {
  const { user, logout } = useAuth()

  return (
    <nav className="bg-white shadow-md border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-primary-600 flex items-center">
            <svg className="w-8 h-8 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 2L4 6V18L12 22L20 18V6L12 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M12 22V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 12L4 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path
                d="M12 12L20 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Auth App
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-gray-700 flex items-center bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                  {user.role === "admin" ? (
                    <Shield className="h-5 w-5 mr-1.5 text-secondary-600" />
                  ) : (
                    <User className="h-5 w-5 mr-1.5 text-primary-600" />
                  )}
                  <span className="font-medium">{user.name || user.email}</span>
                </span>
                <button
                  onClick={logout}
                  className="flex items-center text-gray-700 hover:text-red-600 transition-colors px-3 py-1.5 rounded-md hover:bg-red-50"
                >
                  <LogOut className="h-5 w-5 mr-1.5" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-600 transition-colors px-3 py-1.5 rounded-md hover:bg-gray-50"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors shadow-sm hover:shadow"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
