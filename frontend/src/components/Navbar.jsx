import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { LogOut, User, Shield, Home, Menu, X, Settings, HelpCircle } from "lucide-react"
import { useState } from "react"

const Navbar = () => {
  const { user, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  // Check if current path matches the given path
  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <nav className="bg-white shadow-md border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
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
            Auth System
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md transition-colors ${
                isActive("/")
                  ? "text-primary-700 bg-primary-50"
                  : "text-gray-700 hover:text-primary-600 hover:bg-gray-50"
              }`}
            >
              <Home className="h-5 w-5 inline-block mr-1" />
              Accueil
            </Link>

            {user ? (
              <>
                {/* Additional navigation links for logged in users */}
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    className={`px-3 py-2 rounded-md transition-colors ${
                      isActive("/admin")
                        ? "text-secondary-700 bg-secondary-50"
                        : "text-gray-700 hover:text-secondary-600 hover:bg-gray-50"
                    }`}
                  >
                    <Shield className="h-5 w-5 inline-block mr-1" />
                    Admin
                  </Link>
                )}

                <Link
                  to="/profile"
                  className={`px-3 py-2 rounded-md transition-colors ${
                    isActive("/profile")
                      ? "text-primary-700 bg-primary-50"
                      : "text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                  }`}
                >
                  <Settings className="h-5 w-5 inline-block mr-1" />
                  Profil
                </Link>

                {/* User info */}
                <span className="text-gray-700 flex items-center bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                  {user.role === "admin" ? (
                    <Shield className="h-5 w-5 mr-1.5 text-secondary-600" />
                  ) : (
                    <User className="h-5 w-5 mr-1.5 text-primary-600" />
                  )}
                  <span className="font-medium">{user.name || user.email}</span>
                </span>

                {/* Logout button */}
                <button
                  onClick={logout}
                  className="flex items-center text-gray-700 hover:text-red-600 transition-colors px-3 py-1.5 rounded-md hover:bg-red-50"
                >
                  <LogOut className="h-5 w-5 mr-1.5" />
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                {/* Login/Register links */}
                <Link
                  to="/login"
                  className={`px-3 py-2 rounded-md transition-colors ${
                    isActive("/login")
                      ? "text-primary-700 bg-primary-50"
                      : "text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                  }`}
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors shadow-sm hover:shadow"
                >
                  Inscription
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden text-gray-700 p-2 focus:outline-none" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-2 px-4 shadow-lg">
          <div className="flex flex-col space-y-2">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md transition-colors ${
                isActive("/")
                  ? "text-primary-700 bg-primary-50"
                  : "text-gray-700 hover:text-primary-600 hover:bg-gray-50"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <Home className="h-5 w-5 inline-block mr-2" />
              Accueil
            </Link>

            {user ? (
              <>
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    className={`px-3 py-2 rounded-md transition-colors ${
                      isActive("/admin")
                        ? "text-secondary-700 bg-secondary-50"
                        : "text-gray-700 hover:text-secondary-600 hover:bg-gray-50"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Shield className="h-5 w-5 inline-block mr-2" />
                    Admin
                  </Link>
                )}

                <Link
                  to="/profile"
                  className={`px-3 py-2 rounded-md transition-colors ${
                    isActive("/profile")
                      ? "text-primary-700 bg-primary-50"
                      : "text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Settings className="h-5 w-5 inline-block mr-2" />
                  Profil
                </Link>

                <div className="border-t border-gray-100 my-2 pt-2">
                  <div className="flex items-center px-3 py-2">
                    {user.role === "admin" ? (
                      <Shield className="h-5 w-5 mr-2 text-secondary-600" />
                    ) : (
                      <User className="h-5 w-5 mr-2 text-primary-600" />
                    )}
                    <span className="font-medium">{user.name || user.email}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    logout()
                    setIsMenuOpen(false)
                  }}
                  className="flex items-center text-gray-700 hover:text-red-600 transition-colors px-3 py-2 rounded-md hover:bg-red-50"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`px-3 py-2 rounded-md transition-colors ${
                    isActive("/login")
                      ? "text-primary-700 bg-primary-50"
                      : "text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors shadow-sm hover:shadow text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Inscription
                </Link>
              </>
            )}

            {/* Help/Support link */}
            <div className="border-t border-gray-100 my-2 pt-2">
              <Link
                to="/help"
                className="flex items-center text-gray-700 hover:text-primary-600 transition-colors px-3 py-2 rounded-md hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                <HelpCircle className="h-5 w-5 mr-2" />
                Aide & Support
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
