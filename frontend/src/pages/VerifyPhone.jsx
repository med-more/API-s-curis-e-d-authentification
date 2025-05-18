"use client"

import { useFormik } from "formik"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { Phone, ArrowLeft, Check, RefreshCw } from "lucide-react"
import { useState, useEffect } from "react"
import { phoneVerificationSchema } from "../utils/validation"
import toast from "react-hot-toast"

const VerifyPhone = () => {
  const { user, verifyPhone, resendVerificationCode } = useAuth()
  const navigate = useNavigate()
  const [verificationSuccess, setVerificationSuccess] = useState(false)
  const [resendDisabled, setResendDisabled] = useState(false)
  const [countdown, setCountdown] = useState(0)

  // Redirect if user is not logged in or already verified
  useEffect(() => {
    if (!user) {
      navigate("/login")
    } else if (user.phoneVerified) {
      navigate("/profile")
    }
  }, [user, navigate])

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0 && resendDisabled) {
      setResendDisabled(false)
    }
  }, [countdown, resendDisabled])

  const formik = useFormik({
    initialValues: {
      code: "",
    },
    validationSchema: phoneVerificationSchema,
    onSubmit: async (values) => {
      try {
        const success = await verifyPhone(values.code, user?.phone)
        if (success) {
          setVerificationSuccess(true)
          toast.success("Numéro de téléphone vérifié avec succès")
          // Redirect to profile after a delay
          setTimeout(() => {
            navigate("/profile")
          }, 3000)
        }
      } catch (error) {
        console.error("Verification error:", error)
        toast.error(error.response?.data?.message || "Erreur lors de la vérification du numéro de téléphone")
      }
    },
  })

  // Handle resend verification code
  const handleResendCode = async () => {
    try {
      const success = await resendVerificationCode(user?.phone)
      if (success) {
        toast.success("Code de vérification envoyé avec succès")
        setResendDisabled(true)
        setCountdown(60) // 60 seconds cooldown
      }
    } catch (error) {
      console.error("Resend code error:", error)
      toast.error(error.response?.data?.message || "Erreur lors de l'envoi du code de vérification")
    }
  }

  if (verificationSuccess) {
    return (
      <div className="max-w-md mx-auto card p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
            <Check className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold">Téléphone vérifié!</h1>
          <p className="text-gray-600 mt-4">Votre numéro de téléphone a été vérifié avec succès.</p>
          <p className="text-gray-500 mt-2">Vous allez être redirigé vers votre profil...</p>
        </div>

        <Link to="/profile" className="w-full btn btn-primary flex items-center justify-center">
          Aller au profil
        </Link>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto card p-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 text-primary-600 mb-4">
          <Phone className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold">Vérifier votre téléphone</h1>
        <p className="text-gray-500 mt-2">Nous avons envoyé un code de vérification par SMS au numéro {user?.phone}.</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-blue-800 text-sm">
          Entrez le code à 6 chiffres reçu par SMS pour vérifier votre numéro de téléphone.
        </p>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="code" className="block text-gray-700 font-medium mb-2">
            Code de vérification
          </label>
          <input
            id="code"
            name="code"
            type="text"
            className={`form-input text-center text-lg tracking-widest ${
              formik.touched.code && formik.errors.code ? "border-red-500" : ""
            }`}
            placeholder="------"
            maxLength={6}
            {...formik.getFieldProps("code")}
          />
          {formik.touched.code && formik.errors.code && <div className="form-error">{formik.errors.code}</div>}
        </div>

        <button
          type="submit"
          className="w-full btn btn-primary flex items-center justify-center py-2.5"
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? (
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
          ) : (
            <>
              <Check className="h-5 w-5 mr-2" />
              Vérifier le téléphone
            </>
          )}
        </button>
      </form>

      <div className="mt-6 border-t border-gray-200 pt-6">
        <p className="text-gray-600 mb-4 text-center">Vous n'avez pas reçu le code?</p>
        <button
          type="button"
          className="w-full btn btn-outline flex items-center justify-center"
          onClick={handleResendCode}
          disabled={resendDisabled}
        >
          <RefreshCw className={`h-5 w-5 mr-2 ${resendDisabled ? "animate-spin" : ""}`} />
          {resendDisabled ? `Réessayer dans ${countdown} secondes` : "Renvoyer le code"}
        </button>
      </div>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          <Link
            to="/profile"
            className="text-primary-600 hover:text-primary-700 font-medium flex items-center justify-center"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Retour au profil
          </Link>
        </p>
      </div>
    </div>
  )
}

export default VerifyPhone
