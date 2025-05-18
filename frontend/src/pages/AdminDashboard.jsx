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
  X,
} from "lucide-react"
import { userApi } from "../services/api"
import toast from "react-hot-toast"

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
  const [selectedUser, setSelectedUser] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: ""
  })

  // Fetch users data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await userApi.getAllUsers(page, 10)
        const { users, total } = response.data
        
        // Filter by search term if provided
        const filteredUsers = searchTerm
          ? users.filter(
              (user) =>
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.phone?.includes(searchTerm),
            )
          : users

        setUsersData(filteredUsers)
        setTotalPages(Math.ceil(total / 10))
        setStats(prevStats => ({
          ...prevStats,
          totalUsers: total
        }))

        // Fetch activity logs
        try {
          const logsResponse = await userApi.getActivityLogs()
          setActivityLogs(Array.isArray(logsResponse.data) ? logsResponse.data : [])
        } catch (error) {
          console.error("Error fetching activity logs:", error)
          setActivityLogs([])
        }

        setLoading(false)
      } catch (error) {
        console.error("Error fetching admin data:", error)
        toast.error("Erreur lors du chargement des données")
        setLoading(false)
      }
    }

    fetchData()
  }, [page, searchTerm])

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      handleRefresh()
    }, 30000) // 30 seconds

    return () => clearInterval(intervalId)
  }, [page]) // Re-run effect when page changes

  const handleSearch = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const response = await userApi.searchUsers(searchTerm)
      setUsersData(response.data)
      setTotalPages(Math.ceil(response.data.length / 10))
      setStats(prevStats => ({
        ...prevStats,
        totalUsers: response.data.length
      }))
      toast.success("Recherche effectuée avec succès")
    } catch (error) {
      console.error("Error searching users:", error)
      toast.error("Erreur lors de la recherche des utilisateurs")
    } finally {
      setLoading(false)
    }
  }

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1)
      toast.success("Page précédente")
    }
  }

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1)
      toast.success("Page suivante")
    }
  }

  const handleRefresh = async () => {
    try {
      setLoading(true)
      const response = await userApi.getAllUsers(page, 10)
      const { users, total } = response.data
      
      setUsersData(users)
      setTotalPages(Math.ceil(total / 10))
      setStats(prevStats => ({
        ...prevStats,
        totalUsers: total
      }))

      const logsResponse = await userApi.getActivityLogs()
      setActivityLogs(logsResponse.data)

      toast.success("Données mises à jour avec succès")
    } catch (error) {
      console.error("Error refreshing data:", error)
      toast.error("Erreur lors de la mise à jour des données")
    } finally {
      setLoading(false)
    }
  }

  const handleEditUser = (userData) => {
    setSelectedUser(userData)
    setEditForm({
      name: userData.name,
      email: userData.email,
      phone: userData.phone || "",
      role: userData.role
    })
    setShowEditModal(true)
    toast.success("Modification de l'utilisateur")
  }

  const handleDeleteUser = (userData) => {
    setSelectedUser(userData)
    setShowDeleteModal(true)
    toast.success("Suppression de l'utilisateur")
  }

  const handleUpdateUser = async (e) => {
    e.preventDefault()
    try {
      const response = await userApi.updateUser(selectedUser._id || selectedUser.id, editForm)
      setUsersData(usersData.map(user => 
        (user._id === selectedUser._id || user.id === selectedUser.id) ? response.data : user
      ))
      toast.success("Utilisateur mis à jour avec succès")
      setShowEditModal(false)
    } catch (error) {
      console.error("Error updating user:", error)
      toast.error(error.response?.data?.message || "Erreur lors de la mise à jour de l'utilisateur")
    }
  }

  const handleConfirmDelete = async () => {
    try {
      await userApi.deleteUser(selectedUser._id || selectedUser.id)
      setUsersData(usersData.filter(user => 
        user._id !== selectedUser._id && user.id !== selectedUser.id
      ))
      toast.success("Utilisateur supprimé avec succès")
      setShowDeleteModal(false)
    } catch (error) {
      console.error("Error deleting user:", error)
      toast.error(error.response?.data?.message || "Erreur lors de la suppression de l'utilisateur")
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

      <div className="flex justify-end mb-4">
        <button
          onClick={handleRefresh}
          className="btn btn-outline flex items-center"
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Rafraîchir
        </button>
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
                placeholder="Rechercher par nom, email ou téléphone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                type="submit"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                disabled={loading}
              >
                <Search className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </form>
            <button
              className="text-gray-500 hover:text-gray-700 p-1.5"
              onClick={() => {
                setSearchTerm("")
                handleRefresh()
              }}
              title="Réinitialiser la recherche"
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
              {usersData.map((userData, index) => (
                <tr key={`${userData._id || userData.id || index}-${userData.email}`} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-500" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{userData.name}</div>
                        <div className="text-sm text-gray-500">ID: {userData._id || userData.id}</div>
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
                    <button 
                      onClick={() => handleEditUser(userData)}
                      className="text-secondary-600 hover:text-secondary-900 mr-3"
                    >
                      Modifier
                    </button>
                    <button 
                      onClick={() => handleDeleteUser(userData)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Supprimer
                    </button>
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
          {!Array.isArray(activityLogs) || activityLogs.length === 0 ? (
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

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Modifier l'utilisateur</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleUpdateUser}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nom</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary-500 focus:ring-secondary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary-500 focus:ring-secondary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary-500 focus:ring-secondary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Rôle</label>
                  <select
                    value={editForm.role}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary-500 focus:ring-secondary-500"
                    required
                  >
                    <option value="user">Utilisateur</option>
                    <option value="admin">Administrateur</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="btn btn-outline"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Supprimer l'utilisateur</h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir supprimer l'utilisateur {selectedUser.name} ? Cette action est irréversible.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="btn btn-outline"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmDelete}
                className="btn btn-danger"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
