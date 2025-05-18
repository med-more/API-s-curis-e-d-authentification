import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import {
  Users,
  Search,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  Check,
  X,
  AlertTriangle,
  Mail,
  Phone,
  Clock,
  User,
} from "lucide-react"
import { toast } from "react-hot-toast"
import { userApi } from "../services/api"

const UserManagement = () => {
  const { user } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showUserModal, setShowUserModal] = useState(false)
  const [userHistory, setUserHistory] = useState([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: ""
  })

  // Fetch users on component mount and when page or search changes
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        // In a real app, this would be an API call with pagination and search
        // const response = await api.get(`/admin/users?page=${currentPage}&search=${searchTerm}`)

        // Mock data for demonstration
        const mockUsers = [
          {
            id: 1,
            name: "John Doe",
            email: "john@example.com",
            role: "user",
            emailVerified: true,
            phoneVerified: false,
            createdAt: "2023-01-15T10:30:00Z",
          },
          {
            id: 2,
            name: "Jane Smith",
            email: "jane@example.com",
            role: "user",
            emailVerified: true,
            phoneVerified: true,
            createdAt: "2023-02-20T14:45:00Z",
          },
          {
            id: 3,
            name: "Admin User",
            email: "admin@example.com",
            role: "admin",
            emailVerified: true,
            phoneVerified: true,
            createdAt: "2022-12-10T09:15:00Z",
          },
          {
            id: 4,
            name: "Bob Johnson",
            email: "bob@example.com",
            role: "user",
            emailVerified: false,
            phoneVerified: false,
            createdAt: "2023-03-05T16:20:00Z",
          },
          {
            id: 5,
            name: "Alice Brown",
            email: "alice@example.com",
            role: "user",
            emailVerified: true,
            phoneVerified: false,
            createdAt: "2023-02-28T11:10:00Z",
          },
        ]

        // Filter by search term if provided
        const filteredUsers = searchTerm
          ? mockUsers.filter(
              (user) =>
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase()),
            )
          : mockUsers

        setUsers(filteredUsers)
        setTotalPages(Math.ceil(filteredUsers.length / 10)) // Assuming 10 users per page
        setLoading(false)
      } catch (error) {
        console.error("Error fetching users:", error)
        setError("Failed to load users. Please try again.")
        setLoading(false)
      }
    }

    fetchUsers()
  }, [currentPage, searchTerm])

  // Handle user selection for viewing details
  const handleUserSelect = async (selectedUser) => {
    setSelectedUser(selectedUser)
    setShowUserModal(true)

    // Fetch user history
    try {
      setHistoryLoading(true)

      // Mock data for demonstration
      const mockHistory = [
        {
          id: 1,
          type: "email_change",
          oldValue: "old.email@example.com",
          newValue: selectedUser.email,
          timestamp: "2023-03-10T14:30:00Z",
        },
        {
          id: 2,
          type: "phone_change",
          oldValue: "+1234567890",
          newValue: "+9876543210",
          timestamp: "2023-02-15T09:45:00Z",
        },
        {
          id: 3,
          type: "name_change",
          oldValue: "John D.",
          newValue: selectedUser.name,
          timestamp: "2023-01-20T16:15:00Z",
        },
        { id: 4, type: "login", oldValue: null, newValue: "192.168.1.1", timestamp: "2023-03-12T10:30:00Z" },
        { id: 5, type: "password_reset", oldValue: null, newValue: null, timestamp: "2023-02-01T11:20:00Z" },
      ]

      setUserHistory(mockHistory)
      setHistoryLoading(false)
    } catch (error) {
      console.error("Error fetching user history:", error)
      setUserHistory([])
      setHistoryLoading(false)
    }
  }

  // Handle user deletion
  const handleDeleteUser = (user) => {
    setSelectedUser(user)
    setShowDeleteModal(true)
  }

  // Confirm user deletion
  const confirmDeleteUser = async () => {
    try {
      // In a real app, this would be an API call
      // await api.delete(`/admin/users/${selectedUser.id}`)

      // Update local state
      setUsers(users.filter((u) => u.id !== selectedUser.id))
      setShowDeleteModal(false)
      setSelectedUser(null)

      // Show success message
      toast.success("User deleted successfully")
    } catch (error) {
      console.error("Error deleting user:", error)
      // Show error message
      toast.error("Failed to delete user")
    }
  }

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1) // Reset to first page when search changes
  }

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Get history item details
  const getHistoryDetails = (item) => {
    switch (item.type) {
      case "email_change":
        return {
          icon: <Mail className="h-4 w-4 text-blue-600" />,
          title: "Changement d'email",
          description: `Email modifié de ${item.oldValue} à ${item.newValue}`,
          color: "blue",
        }
      case "phone_change":
        return {
          icon: <Phone className="h-4 w-4 text-green-600" />,
          title: "Changement de téléphone",
          description: `Téléphone modifié de ${item.oldValue} à ${item.newValue}`,
          color: "green",
        }
      case "name_change":
        return {
          icon: <Edit className="h-4 w-4 text-purple-600" />,
          title: "Changement de nom",
          description: `Nom modifié de ${item.oldValue} à ${item.newValue}`,
          color: "purple",
        }
      case "login":
        return {
          icon: <Check className="h-4 w-4 text-green-600" />,
          title: "Connexion",
          description: `Connexion depuis l'IP ${item.newValue}`,
          color: "green",
        }
      case "password_reset":
        return {
          icon: <AlertTriangle className="h-4 w-4 text-yellow-600" />,
          title: "Réinitialisation de mot de passe",
          description: "Mot de passe réinitialisé",
          color: "yellow",
        }
      default:
        return {
          icon: <Clock className="h-4 w-4 text-gray-600" />,
          title: "Activité",
          description: "Activité utilisateur",
          color: "gray",
        }
    }
  }

  const handleEditUser = (user) => {
    setSelectedUser(user)
    setEditForm({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    })
    setIsEditing(true)
    setShowUserModal(true)
  }

  const handleUpdateUser = async (e) => {
    e.preventDefault()
    try {
      const response = await userApi.updateUser(selectedUser.id, editForm)
      toast.success("Utilisateur mis à jour avec succès")
      
      // Mettre à jour la liste des utilisateurs
      const updatedUsers = users.map(u => 
        u.id === selectedUser.id ? response.data.user : u
      )
      setUsers(updatedUsers)
      
      setIsEditing(false)
      setShowUserModal(false)
    } catch (error) {
      toast.error(error.response?.data?.message || "Erreur lors de la mise à jour de l'utilisateur")
    }
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="max-w-6xl mx-auto text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-4">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Accès non autorisé</h1>
        <p className="text-gray-600">Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center">
          <Users className="h-8 w-8 mr-3 text-secondary-600" />
          Gestion des utilisateurs
        </h1>
        <p className="text-gray-600">Gérez les comptes utilisateurs, les permissions et les accès.</p>
      </div>

      {/* Search and filters */}
      <div className="card p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="form-input pl-10 w-full"
              placeholder="Rechercher par nom ou email..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              {users.length} utilisateur{users.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Users table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des utilisateurs...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600 mb-4">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <p className="text-red-600">{error}</p>
            <button
              className="mt-4 btn btn-outline"
              onClick={() => {
                setError(null)
                setCurrentPage(1)
              }}
            >
              Réessayer
            </button>
          </div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 text-gray-600 mb-4">
              <Users className="h-6 w-6" />
            </div>
            <p className="text-gray-600">Aucun utilisateur trouvé</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utilisateur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rôle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date d'inscription
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-gray-500" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">ID: {user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                      <div className="text-xs text-gray-500 flex items-center">
                        {user.emailVerified ? (
                          <span className="flex items-center text-green-600">
                            <Check className="h-3 w-3 mr-1" /> Vérifié
                          </span>
                        ) : (
                          <span className="flex items-center text-yellow-600">
                            <AlertTriangle className="h-3 w-3 mr-1" /> Non vérifié
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.role === "admin" ? "bg-purple-100 text-purple-800" : "bg-green-100 text-green-800"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {user.emailVerified && user.phoneVerified
                          ? "Actif"
                          : !user.emailVerified && !user.phoneVerified
                            ? "En attente"
                            : "Partiellement vérifié"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {user.phoneVerified ? (
                          <span className="flex items-center text-green-600">
                            <Check className="h-3 w-3 mr-1" /> Téléphone vérifié
                          </span>
                        ) : (
                          <span className="flex items-center text-yellow-600">
                            <AlertTriangle className="h-3 w-3 mr-1" /> Téléphone non vérifié
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(user.createdAt)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleUserSelect(user)}
                        className="text-secondary-600 hover:text-secondary-900 mr-3"
                      >
                        Détails
                      </button>
                      <button onClick={() => handleDeleteUser(user)} className="text-red-600 hover:text-red-900">
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && users.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="btn btn-outline py-1 px-4 text-sm"
              >
                Précédent
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="btn btn-outline py-1 px-4 text-sm"
              >
                Suivant
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Affichage de <span className="font-medium">{(currentPage - 1) * 10 + 1}</span> à{" "}
                  <span className="font-medium">{Math.min(currentPage * 10, users.length)}</span> sur{" "}
                  <span className="font-medium">{users.length}</span> résultats
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Précédent</span>
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  {/* Page numbers */}
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === i + 1
                          ? "z-10 bg-secondary-50 border-secondary-500 text-secondary-600"
                          : "text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Suivant</span>
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-semibold">
                {isEditing ? "Modifier l'utilisateur" : "Détails de l'utilisateur"}
              </h3>
              <button
                onClick={() => {
                  setShowUserModal(false)
                  setSelectedUser(null)
                  setIsEditing(false)
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {isEditing ? (
                <form onSubmit={handleUpdateUser} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nom</label>
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                      <input
                        type="tel"
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Rôle</label>
                      <select
                        value={editForm.role}
                        onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      >
                        <option value="user">Utilisateur</option>
                        <option value="admin">Administrateur</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false)
                        setEditForm({
                          name: selectedUser.name,
                          email: selectedUser.email,
                          phone: selectedUser.phone,
                          role: selectedUser.role
                        })
                      }}
                      className="btn btn-outline"
                    >
                      Annuler
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Enregistrer
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  <div className="flex-shrink-0 flex flex-col items-center">
                    <div className="h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center">
                      <User className="h-12 w-12 text-gray-500" />
                    </div>
                    <span
                      className={`mt-2 px-3 py-1 text-xs font-semibold rounded-full ${
                        selectedUser.role === "admin" ? "bg-purple-100 text-purple-800" : "bg-green-100 text-green-800"
                      }`}
                    >
                      {selectedUser.role}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-lg font-semibold">{selectedUser.name}</h4>
                        <p className="text-gray-600">{selectedUser.email}</p>
                      </div>
                      <button
                        onClick={() => handleEditUser(selectedUser)}
                        className="btn btn-outline flex items-center"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Modifier
                      </button>
                    </div>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <h5 className="text-sm font-medium text-gray-500 mb-1">ID</h5>
                        <p className="text-gray-900">{selectedUser.id}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <h5 className="text-sm font-medium text-gray-500 mb-1">Date d'inscription</h5>
                        <p className="text-gray-900">{formatDate(selectedUser.createdAt)}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <h5 className="text-sm font-medium text-gray-500 mb-1">Email vérifié</h5>
                        <p className="flex items-center">
                          {selectedUser.emailVerified ? (
                            <span className="flex items-center text-green-600">
                              <Check className="h-4 w-4 mr-1" /> Oui
                            </span>
                          ) : (
                            <span className="flex items-center text-red-600">
                              <X className="h-4 w-4 mr-1" /> Non
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <h5 className="text-sm font-medium text-gray-500 mb-1">Téléphone vérifié</h5>
                        <p className="flex items-center">
                          {selectedUser.phoneVerified ? (
                            <span className="flex items-center text-green-600">
                              <Check className="h-4 w-4 mr-1" /> Oui
                            </span>
                          ) : (
                            <span className="flex items-center text-red-600">
                              <X className="h-4 w-4 mr-1" /> Non
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* User History */}
              <div className="mt-8">
                <h4 className="text-lg font-semibold mb-4">Historique des modifications</h4>
                {historyLoading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-secondary-600 mx-auto"></div>
                    <p className="text-gray-500 mt-2">Chargement de l'historique...</p>
                  </div>
                ) : userHistory.length === 0 ? (
                  <div className="text-center py-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">Aucun historique disponible</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {userHistory.map((item) => {
                      const details = getHistoryDetails(item)
                      return (
                        <div
                          key={item.id}
                          className={`p-3 rounded-lg border border-${details.color}-100 bg-${details.color}-50`}
                        >
                          <div className="flex items-start">
                            <div className={`p-2 rounded-full bg-${details.color}-100 mr-3`}>{details.icon}</div>
                            <div>
                              <p className="font-medium">{details.title}</p>
                              <p className="text-sm text-gray-600">{details.description}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(item.timestamp).toLocaleString("fr-FR")}
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600 mx-auto mb-4">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-center mb-4">Confirmer la suppression</h3>
              <p className="text-gray-600 text-center mb-6">
                Êtes-vous sûr de vouloir supprimer l'utilisateur <strong>{selectedUser.name}</strong> ? Cette action est
                irréversible.
              </p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false)
                    setSelectedUser(null)
                  }}
                  className="btn btn-outline"
                >
                  Annuler
                </button>
                <button
                  onClick={confirmDeleteUser}
                  className="btn bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserManagement
