"use client"

import { useFormik } from "formik"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { User, Mail, Phone, Lock, Save, Check, AlertTriangle, Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { profileUpdateSchema } from "../utils/validation"

const Profile = () => {
  const { user, updateProfile } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const formik = useFormik({
    initialValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    enableReinitialize: true,
    validationSchema: profileUpdateSchema,
    onSubmit: async (values) => {
      try {
        const updateData = {
          name: values.name,
          email: values.email,
          phone: values.phone,
        }

        // Only include password fields if currentPassword is provided
        if (values.currentPassword) {
          updateData.currentPassword = values.currentPassword
          updateData.newPassword = values.newPassword
        }

        const success = await updateProfile(updateData)
        if (success) {
          // Reset password fields
          formik.setFieldValue("currentPassword", "")
          formik.setFieldValue("newPassword", "")
          formik.setFieldValue("confirmNewPassword", "")
          setIsEditing(false)
        }
      } catch (error) {
        console.error("Profile update error:", error)
      }
    },
  })

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword((prev) => !prev)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev)
  }

  const handleCancel = () => {
    formik.resetForm()
    setIsEditing(false)
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-full mb-4">
          <User className="h-10 w-10 text-primary-600" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Profil utilisateur</h1>
        <p className="text-gray-600">Gérez vos informations personnelles et vos préférences</p>
      </div>

      <div className="card p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Informations personnelles</h2>
          {!isEditing ? (
            <button type="button" className="btn btn-outline px-4 py-2" onClick={() => setIsEditing(true)}>
              Modifier
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              <button type="button" className="text-gray-600 hover:text-gray-800 font-medium" onClick={handleCancel}>
                Annuler
              </button>
            </div>
          )}
        </div>

        <form onSubmit={formik.handleSubmit}>
          <div className="space-y-6">
            {/* Name field */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <label htmlFor="name" className="font-medium text-gray-700">
                Nom complet
              </label>
              <div className="md:col-span-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className={`form-input pl-10 ${formik.touched.name && formik.errors.name ? "border-red-500" : ""}`}
                    placeholder="Votre nom complet"
                    {...formik.getFieldProps("name")}
                    disabled={!isEditing}
                  />
                </div>
                {formik.touched.name && formik.errors.name && <div className="form-error">{formik.errors.name}</div>}
              </div>
            </div>

            {/* Email field */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <label htmlFor="email" className="font-medium text-gray-700">
                Adresse email
              </label>
              <div className="md:col-span-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className={`form-input pl-10 ${
                      formik.touched.email && formik.errors.email ? "border-red-500" : ""
                    }`}
                    placeholder="Votre adresse email"
                    {...formik.getFieldProps("email")}
                    disabled={!isEditing}
                  />
                  {user?.emailVerified ? (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <div className="flex items-center text-green-600">
                        <Check className="h-4 w-4 mr-1" />
                        <span className="text-xs">Vérifié</span>
                      </div>
                    </div>
                  ) : (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <div className="flex items-center text-yellow-600">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        <span className="text-xs">Non vérifié</span>
                      </div>
                    </div>
                  )}
                </div>
                {formik.touched.email && formik.errors.email && <div className="form-error">{formik.errors.email}</div>}
                {!user?.emailVerified && (
                  <div className="mt-1">
                    <Link to="/verify-email" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                      Vérifier mon email
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Phone field */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <label htmlFor="phone" className="font-medium text-gray-700">
                Téléphone
              </label>
              <div className="md:col-span-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className={`form-input pl-10 ${
                      formik.touched.phone && formik.errors.phone ? "border-red-500" : ""
                    }`}
                    placeholder="Votre numéro de téléphone"
                    {...formik.getFieldProps("phone")}
                    disabled={!isEditing}
                  />
                  {user?.phoneVerified ? (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <div className="flex items-center text-green-600">
                        <Check className="h-4 w-4 mr-1" />
                        <span className="text-xs">Vérifié</span>
                      </div>
                    </div>
                  ) : (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <div className="flex items-center text-yellow-600">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        <span className="text-xs">Non vérifié</span>
                      </div>
                    </div>
                  )}
                </div>
                {formik.touched.phone && formik.errors.phone && <div className="form-error">{formik.errors.phone}</div>}
                {!user?.phoneVerified && (
                  <div className="mt-1">
                    <Link to="/verify-phone" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                      Vérifier mon téléphone
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {isEditing && (
              <>
                <div className="border-t border-gray-200 pt-6 mt-6">
                  <h3 className="text-lg font-medium mb-4">Changer de mot de passe</h3>
                  <p className="text-gray-500 text-sm mb-4">
                    Laissez ces champs vides si vous ne souhaitez pas changer votre mot de passe.
                  </p>

                  {/* Current Password field */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center mb-4">
                    <label htmlFor="currentPassword" className="font-medium text-gray-700">
                      Mot de passe actuel
                    </label>
                    <div className="md:col-span-2">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="currentPassword"
                          name="currentPassword"
                          type={showPassword ? "text" : "password"}
                          className={`form-input pl-10 pr-10 ${
                            formik.touched.currentPassword && formik.errors.currentPassword ? "border-red-500" : ""
                          }`}
                          placeholder="Entrez votre mot de passe actuel"
                          {...formik.getFieldProps("currentPassword")}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                      {formik.touched.currentPassword && formik.errors.currentPassword && (
                        <div className="form-error">{formik.errors.currentPassword}</div>
                      )}
                    </div>
                  </div>

                  {/* New Password field */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center mb-4">
                    <label htmlFor="newPassword" className="font-medium text-gray-700">
                      Nouveau mot de passe
                    </label>
                    <div className="md:col-span-2">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="newPassword"
                          name="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          className={`form-input pl-10 pr-10 ${
                            formik.touched.newPassword && formik.errors.newPassword ? "border-red-500" : ""
                          }`}
                          placeholder="Entrez votre nouveau mot de passe"
                          {...formik.getFieldProps("newPassword")}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={toggleNewPasswordVisibility}
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                      {formik.touched.newPassword && formik.errors.newPassword && (
                        <div className="form-error">{formik.errors.newPassword}</div>
                      )}
                    </div>
                  </div>

                  {/* Confirm New Password field */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <label htmlFor="confirmNewPassword" className="font-medium text-gray-700">
                      Confirmer le mot de passe
                    </label>
                    <div className="md:col-span-2">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="confirmNewPassword"
                          name="confirmNewPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          className={`form-input pl-10 pr-10 ${
                            formik.touched.confirmNewPassword && formik.errors.confirmNewPassword
                              ? "border-red-500"
                              : ""
                          }`}
                          placeholder="Confirmez votre nouveau mot de passe"
                          {...formik.getFieldProps("confirmNewPassword")}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={toggleConfirmPasswordVisibility}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                      {formik.touched.confirmNewPassword && formik.errors.confirmNewPassword && (
                        <div className="form-error">{formik.errors.confirmNewPassword}</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    className="btn btn-primary flex items-center justify-center py-2.5 px-6"
                    disabled={formik.isSubmitting}
                  >
                    {formik.isSubmitting ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <Save className="h-5 w-5 mr-2" />
                        Enregistrer les modifications
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </form>
      </div>

      {/* Account Information Card */}
      <div className="card p-8 mt-6">
        <h2 className="text-xl font-semibold mb-6">Informations du compte</h2>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <span className="font-medium text-gray-700">Identifiant</span>
            <div className="md:col-span-2">
              <span className="text-gray-900">{user.id}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <span className="font-medium text-gray-700">Type de compte</span>
            <div className="md:col-span-2">
              <span className="bg-primary-100 text-primary-800 py-1 px-3 rounded-full text-sm font-medium capitalize">
                {user.role}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <span className="font-medium text-gray-700">Date de création</span>
            <div className="md:col-span-2">
              <span className="text-gray-900">
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("fr-FR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Non disponible"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <span className="font-medium text-gray-700">Dernière mise à jour</span>
            <div className="md:col-span-2">
              <span className="text-gray-900">
                {user.updatedAt
                  ? new Date(user.updatedAt).toLocaleDateString("fr-FR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Non disponible"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
