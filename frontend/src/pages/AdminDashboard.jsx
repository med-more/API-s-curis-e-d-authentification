import { useAuth } from "../context/AuthContext"
import {
  Shield,
  Users,
  Activity,
  BarChartIcon as ChartBar,
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
} from "lucide-react"

const AdminDashboard = () => {
  const { user } = useAuth()

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-secondary-100 rounded-full mb-4">
          <Shield className="h-10 w-10 text-secondary-600" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">System administration and management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6 flex items-center">
          <div className="bg-secondary-100 p-3 rounded-full mr-4">
            <User className="h-6 w-6 text-secondary-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Name</h3>
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
            <h3 className="text-sm font-medium text-gray-500">Role</h3>
            <p className="text-lg font-semibold capitalize">{user?.role || "admin"}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-semibold flex items-center">
              <ChartBar className="h-5 w-5 mr-2 text-secondary-600" />
              System Overview
            </h2>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
                  <Users className="h-5 w-5 text-secondary-600" />
                </div>
                <p className="text-2xl font-bold">248</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <ArrowUp className="h-3 w-3 mr-1" /> 12% from last month
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-500">Active Sessions</h3>
                  <Activity className="h-5 w-5 text-secondary-600" />
                </div>
                <p className="text-2xl font-bold">42</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <ArrowUp className="h-3 w-3 mr-1" /> 8% from yesterday
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-500">Server Load</h3>
                  <Server className="h-5 w-5 text-secondary-600" />
                </div>
                <p className="text-2xl font-bold">28%</p>
                <p className="text-xs text-red-600 flex items-center mt-1">
                  <ArrowDown className="h-3 w-3 mr-1" /> 3% from yesterday
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-500">Database Size</h3>
                  <Database className="h-5 w-5 text-secondary-600" />
                </div>
                <p className="text-2xl font-bold">1.2 GB</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <ArrowUp className="h-3 w-3 mr-1" /> 5% from last week
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-semibold flex items-center">
              <Lock className="h-5 w-5 mr-2 text-secondary-600" />
              Security Alerts
            </h2>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              <div className="flex items-start p-3 rounded-lg bg-red-50 border border-red-100">
                <div className="bg-red-100 p-2 rounded-full mr-3">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="font-medium">Failed login attempts detected</p>
                  <p className="text-sm text-gray-600">3 failed attempts from IP 192.168.1.1</p>
                  <p className="text-xs text-gray-500 mt-1">Today at 10:45 AM</p>
                </div>
              </div>

              <div className="flex items-start p-3 rounded-lg bg-yellow-50 border border-yellow-100">
                <div className="bg-yellow-100 p-2 rounded-full mr-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="font-medium">System update required</p>
                  <p className="text-sm text-gray-600">Security patch available for installation</p>
                  <p className="text-xs text-gray-500 mt-1">Yesterday at 8:30 PM</p>
                </div>
              </div>

              <div className="flex items-start p-3 rounded-lg bg-green-50 border border-green-100">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Backup completed successfully</p>
                  <p className="text-sm text-gray-600">Database backup completed and stored</p>
                  <p className="text-xs text-gray-500 mt-1">Yesterday at 2:15 AM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
