"use client"

import { useAuth } from "../context/AuthContext"
import { useState, useEffect } from "react"
import {
  Shield,
  Users,
  Activity,
  BarChart,
  Database,
  Lock,
  Server,
  User,
  Mail,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  Search,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Phone,
} from "lucide-react"

const AdminDashboard = () => {
  const { user } = useAuth()
  const [usersData, setUsersData] = useState([])
  const [activityLogs, setActivityLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeSessions: 0,
    serverLoad: 0,
    databaseSize: 0,
  })

  // Fetch users data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        // In a real app, these would be real API calls
        // For demo purposes, we'll create mock data

        // Mock users data
        const mockUsers = [
          {
            id: "u1",
            name: "Jean Dupont",
            email: "jean@example.com",
            phone: "+33612345678",
            role: "user",
            emailVerified: true,
            phoneVerified: true,
            createdAt: new Date(2023, 0, 15).toISOString(),
            updatedAt: new Date(2023, 2, 20).toISOString(),
          },
          {
            id: "u2",
            name: "Marie Martin",
            email: "marie@example.com",
            phone: "+33687654321",
            role: "user",
            emailVerified: true,
            phoneVerified: false,
            createdAt: new Date(2023, 1, 5).toISOString(),
            updatedAt: new Date(2023, 1, 5).toISOString(),
          },
          {
            id: "u3",
            name: "Lucas Bernard",
            email: "lucas@example.com",
            phone: "+33678901234",
            role: "admin",
            emailVerified: true,
            phoneVerified: true,
            createdAt: new Date(2022, 11, 10).toISOString(),
            updatedAt: new Date(2023, 3, 15).toISOString(),
          },
          {
            id: "u4",
            name: "Sophie Petit",
            email: "sophie@example.com",
            phone: "+33699887766",
            role: "user",
            emailVerified: false,
            phoneVerified: false,
            createdAt: new Date(2023, 2, 25).toISOString(),
            updatedAt: new Date(2023, 2, 25).toISOString(),
          },
          {
            id: "u5",
            name: "Pierre Durand",
            email: "pierre@example.com",
            phone: "+33655443322",
            role: "user",
            emailVerified: true,
            phoneVerified: true,
            createdAt: new Date(2023, 3, 5).toISOString(),
            updatedAt: new Date(2023, 3, 5).toISOString(),
          },
        ]

        // Filter by search term if provided
        const filteredUsers = searchTerm
          ? mockUsers.filter(
              (user) =>
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.phone.includes(searchTerm),
            )
          : mockUsers

        setUsersData(filteredUsers)
        setTotalPages(Math.ceil(filteredUsers.length / 10))

        // Mock activity logs
        const mockLogs = [
          {
            id: "l1",
            userId: "u1",
            userName: "Jean Dupont",
            action: "PROFILE_UPDATE",
            details: "Email changé de jean.old@example.com à jean@example.com",
            timestamp: new Date(2023, 2, 20, 14, 35).toISOString(),
          },
          {
            id: "l2",
            userId: "u2",
            userName: "Marie Martin",
            action: "PHONE_UPDATE",
            details: "Téléphone changé de +33687654320 à +33687654321",
            timestamp: new Date(2023, 1, 5, 10, 22).toISOString(),
          },
          {
            id: "l3",
            userId: "u3",
            userName: "Lucas Bernard",
            action: "PASSWORD_CHANGE",
            details: "Mot de passe modifié",
            timestamp: new Date(2023, 3, 15, 16, 45).toISOString(),
          },
          {
            id: "l4",
            userId: "u1",
            userName: "Jean Dupont",
            action: "LOGIN",
            details: "Connexion depuis une nouvelle adresse IP",
            timestamp: new Date(2023, 3, 18, 9, 15).toISOString(),
          },
          {
            id: "l5",
            userId: "u4",
            userName: "Sophie Petit",
            action: "REGISTRATION",
            details: "Nouvel utilisateur inscrit",
            timestamp: new Date(2023, 2, 25, 11, 5).toISOString(),
          },
        ]

        setActivityLogs(mockLogs)

        // Mock stats
        setStats({
          totalUsers: 248,
          activeSessions: 42,
          serverLoad: 28,
          databaseSize: 1.2,
        })

        setLoading(false)
      } catch (error) {
        console.error("Error fetching admin data:", error)
        setLoading(false)
      }
    }

    fetchData()
  }, [searchTerm])

  const handleSearch = (e) => {
    e.preventDefault()
    // Search is handled by the useEffect above
  }

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1)
    }
  }

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-secondary-100 rounded-full mb-4">
          <Shield className="h-10 w-10 text-secondary-600" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Tableau de bord administrateur</h1>
        <p className="text-gray-600">Administration et gestion du système</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6 flex items-center">
          <div className="bg-secondary-100 p-3 rounded-full mr-4">
            <User className="h-6 w-6 text-secondary-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Nom</h3>
            <p className="text-lg font-semibold">{user?.name || "N/A"}</p>
          </div>
        </div>

        <div className="card p-6 flex items-center">
          <div className="bg-secondary-100 p-3 rounded-full mr-4">
            <Mail className="h-6 w-6 text-secondary-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Email</h3>
            <p className="text-lg font-semibold">{user?.email || "N/A"}</p>
          </div>
        </div>

        <div className="card p-6 flex items-center">
          <div className="bg-secondary-100 p-3 rounded-full mr-4">
            <Shield className="h-6 w-6 text-secondary-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Rôle</h3>
            <p className="text-lg font-semibold capitalize">{user?.role || "admin"}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-semibold flex items-center">
              <BarChart className="h-5 w-5 mr-2 text-secondary-600" />
              Vue d'ensemble du système
            </h2>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-500">Utilisateurs totaux</h3>
                  <Users className="h-5 w-5 text-secondary-600" />
                </div>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <ArrowUp className="h-3 w-3 mr-1" /> 12% depuis le mois dernier
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-500">Sessions actives</h3>
                  <Activity className="h-5 w-5 text-secondary-600" />
                </div>
                <p className="text-2xl font-bold">{stats.activeSessions}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <ArrowUp className="h-3 w-3 mr-1" /> 8% depuis hier
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-500">Charge serveur</h3>
                  <Server className="h-5 w-5 text-secondary-600" />
                </div>
                <p className="text-2xl font-bold">{stats.serverLoad}%</p>
                <p className="text-xs text-red-600 flex items-center mt-1">
                  <ArrowDown className="h-3 w-3 mr-1" /> 3% depuis hier
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-500">Taille de la base de données</h3>
                  <Database className="h-5 w-5 text-secondary-600" />
                </div>
                <p className="text-2xl font-bold">{stats.databaseSize} GB</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <ArrowUp className="h-3 w-3 mr-1" /> 5% depuis la semaine dernière
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-semibold flex items-center">
              <Lock className="h-5 w-5 mr-2 text-secondary-600" />
              Alertes de sécurité
            </h2>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              <div className="flex items-start p-3 rounded-lg bg-red-50 border border-red-100">
                <div className="bg-red-100 p-2 rounded-full mr-3">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="font-medium">Tentatives de connexion échouées détectées</p>
                  <p className="text-sm text-gray-600">3 tentatives échouées depuis l'IP 192.168.1.1</p>
                  <p className="text-xs text-gray-500 mt-1">Aujourd'hui à 10:45</p>
                </div>
              </div>

              <div className="flex items-start p-3 rounded-lg bg-yellow-50 border border-yellow-100">
                <div className="bg-yellow-100 p-2 rounded-full mr-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="font-medium">Mise à jour système requise</p>
                  <p className="text-sm text-gray-600">Patch de sécurité disponible pour l'installation</p>
                  <p className="text-xs text-gray-500 mt-1">Hier à 20:30</p>
                </div>
              </div>

              <div className="flex items-start p-3 rounded-lg bg-green-50 border border-green-100">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Sauvegarde terminée avec succès</p>
                  <p className="text-sm text-gray-600">Sauvegarde de la base de données terminée et stockée</p>
                  <p className="text-xs text-gray-500 mt-1">Hier à 02:15</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Management Section */}
      <div className="card mb-8">
        <div className="card-header flex justify-between items-center">
          <h2 className="text-xl font-semibold flex items-center">
            <Users className="h-5 w-5 mr-2 text-secondary-600" />
            Gestion des utilisateurs
          </h2>

          <div className="flex items-center">
            <form onSubmit={handleSearch} className="relative mr-2">
              <input
                type="text"
                className="form-input pr-10 py-1.5 text-sm"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                type="submit"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
              >
                <Search className="h-4 w-4" />
              </button>
            </form>
            <button
              className="text-gray-500 hover:text-gray-700 p-1.5"
              onClick={() => setSearchTerm("")}
              title="Rafraîchir"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Utilisateur
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Contact
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Rôle
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Statut
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date de création
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {usersData.map((userData) => (
                <tr key={userData.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-500" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{userData.name}</div>
                        <div className="text-sm text-gray-500">ID: {userData.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center">
                      <Mail className="h-4 w-4 mr-1 text-gray-400" />
                      {userData.email}
                      {userData.emailVerified && <CheckCircle className="h-4 w-4 ml-1 text-green-500" />}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <Phone className="h-4 w-4 mr-1 text-gray-400" />
                      {userData.phone}
                      {userData.phoneVerified && <CheckCircle className="h-4 w-4 ml-1 text-green-500" />}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        userData.role === "admin"
                          ? "bg-secondary-100 text-secondary-800"
                          : "bg-primary-100 text-primary-800"
                      }`}
                    >
                      {userData.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        userData.emailVerified && userData.phoneVerified
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {userData.emailVerified && userData.phoneVerified ? "Vérifié" : "Partiellement vérifié"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(userData.createdAt).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-secondary-600 hover:text-secondary-900 mr-3">Modifier</button>
                    <button className="text-red-600 hover:text-red-900">Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card-footer flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Affichage de <span className="font-medium">1</span> à{" "}
            <span className="font-medium">{usersData.length}</span> sur{" "}
            <span className="font-medium">{stats.totalUsers}</span> utilisateurs
          </div>
          <div className="flex space-x-1">
            <button
              onClick={handlePrevPage}
              disabled={page === 1}
              className={`btn btn-outline p-2 ${page === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={handleNextPage}
              disabled={page === totalPages}
              className={`btn btn-outline p-2 ${page === totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Activity Log Section */}
      <div className="card mb-8">
        <div className="card-header">
          <h2 className="text-xl font-semibold flex items-center">
            <Activity className="h-5 w-5 mr-2 text-secondary-600" />
            Historique des activités
          </h2>
        </div>
        <div className="card-body">
          {activityLogs.length === 0 ? (
            <p className="text-gray-500">Aucune activité récente.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {activityLogs.map((log) => (
                <li key={log.id} className="py-4">
                  <div className="flex items-center space-x-3">
                    <div>
                      <p className="text-gray-700 font-medium">{log.userName}</p>
                      <p className="text-gray-500 text-sm">{log.details}</p>
                    </div>
                  </div>
                  <div className="text-gray-400 text-sm">{new Date(log.timestamp).toLocaleString()}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
