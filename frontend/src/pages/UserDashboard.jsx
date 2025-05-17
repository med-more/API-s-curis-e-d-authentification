"use client"

import { useAuth } from "../context/AuthContext"
import { User, Mail, Calendar, Settings, Bell, FileText, Shield, Activity } from "lucide-react"

const UserDashboard = () => {
  const { user } = useAuth()

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-full mb-4">
          <User className="h-10 w-10 text-primary-600" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Hello, User!</h1>
        <p className="text-gray-600">Welcome to your personal dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6 flex items-center">
          <div className="bg-primary-100 p-3 rounded-full mr-4">
            <User className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Name</h3>
            <p className="text-lg font-semibold">{user?.name || "N/A"}</p>
          </div>
        </div>

        <div className="card p-6 flex items-center">
          <div className="bg-primary-100 p-3 rounded-full mr-4">
            <Mail className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Email</h3>
            <p className="text-lg font-semibold">{user?.email || "N/A"}</p>
          </div>
        </div>

        <div className="card p-6 flex items-center">
          <div className="bg-primary-100 p-3 rounded-full mr-4">
            <Shield className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Role</h3>
            <p className="text-lg font-semibold capitalize">{user?.role || "user"}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card p-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
            <FileText className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold mb-1">12</h3>
          <p className="text-gray-500">Documents</p>
        </div>

        <div className="card p-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
            <Calendar className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold mb-1">4</h3>
          <p className="text-gray-500">Events</p>
        </div>

        <div className="card p-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mb-4">
            <Bell className="h-6 w-6 text-yellow-600" />
          </div>
          <h3 className="text-xl font-semibold mb-1">7</h3>
          <p className="text-gray-500">Notifications</p>
        </div>

        <div className="card p-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4">
            <Settings className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold mb-1">3</h3>
          <p className="text-gray-500">Settings</p>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Activity className="h-5 w-5 mr-2 text-primary-600" />
          Recent Activity
        </h2>
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="bg-primary-100 p-2 rounded-full mr-3">
                <Activity className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <p className="font-medium">You logged in from a new device</p>
                <p className="text-sm text-gray-500">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default UserDashboard
