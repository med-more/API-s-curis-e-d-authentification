"use client"

import { useFormik } from "formik"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { Mail, ArrowLeft, Check, RefreshCw } from "lucide-react"
import { useState, useEffect } from "react"
import { emailVerificationSchema } from "../utils/validation"

const VerifyEmail = () => {
  const { verifyEmail, resendVerification } = useAuth()
  const { token } = useParams()
  const navigate = useNavigate()
  const [verifying, setVerifying] = useState(!!token)
  const [verificationSuccess, setVerificationSuccess] = useState(false)
  const [resendDisabled, setResendDisabled] = useState(false)
  const [countdown, setCountdown] = useState(0)

  // Get email for resend from localStorage
  const pendingEmail = localStorage.getItem("pendingVerificationEmail")

  // Auto-verify if token is provided in URL
  useEffect(() => {
    const autoVerify = async () => {
      if (token) {
        try {
          const success = await verifyEmail(token)
          if (success) {
            setVerificationSuccess(true)
            // Redirect to login after a delay
            setTimeout(() => {
              navigate("/login")
            }, 3000)
          } else {
            setVerifying(false)
          }
        } catch (error) {
          console.error("Verification error:", error)
          setVerifying(false)
        }
      }
    }

    if (token) {
      autoVerify()
    }
  }, [token, verifyEmail, navigate])

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
      token: token || "",
    },
    validationSchema: emailVerificationSchema,
    onSubmit: async (values) => {
      try {
        const success = await verifyEmail(values.token)
        if (success) {
          setVerificationSuccess(true)
          // Redirect to login after a delay
          setTimeout(() => {
            navigate("/login")
          }, 3000)
        }
      } catch (error) {
        console.error("Verification error:", error)
      }
    },
  })

  // Handle resend verification email
  const handleResend = async () => {
    if (!pendingEmail || resendDisabled) return

    try {
      const success = await resendVerification(pendingEmail)
      if (success) {
        setResendDisabled(true)
        setCountdown(60) // 60 seconds cooldown
      }
    } catch (error) {
      console.error("Resend verification error:", error)
    }
  }

  if (verificationSuccess) {
    return (
      <div className="max-w-md mx-auto card p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
            <Check className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold">Email vérifié!</h1>
          <p className="text-gray-600 mt-4">Votre adresse email a été vérifiée avec succès.</p>
          <p className="text-gray-500 mt-2">Vous allez être redirigé vers la page de connexion...</p>
        </div>

        <Link to="/login" className="w-full btn btn-primary flex items-center justify-center">
          Aller à la connexion
        </Link>
      </div>
    )
  }

  if (verifying) {
    return (
      <div className="max-w-md mx-auto card p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 text-primary-600 mb-4">
            <RefreshCw className="h-8 w-8 animate-spin" />
          </div>
          <h1 className="text-2xl font-bold">Vérification en cours...</h1>
          <p className="text-gray-500 mt-2">Nous vérifions votre adresse email. Veuillez patienter.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto card p-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 text-primary-600 mb-4">
          <Mail className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold">Vérifier votre email</h1>
        <p className="text-gray-500 mt-2">
          {pendingEmail
            ? `Nous avons envoyé un email de vérification à ${pendingEmail}`
            : "Vérifiez votre adresse email pour activer votre compte"}
        </p>
      </div>

      {pendingEmail && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-800 text-sm">
            Vérifiez votre boîte de réception et votre dossier spam pour trouver l'email de vérification. Cliquez sur le
            lien dans l'email ou entrez le code de vérification ci-dessous.
          </p>
        </div>
      )}

      <form onSubmit={formik.handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="token" className="block text-gray-700 font-medium mb-2">
            Code de vérification
          </label>
          <input
            id="token"
            name="token"
            type="text"
            className={`form-input ${formik.touched.token && formik.errors.token ? "border-red-500" : ""}`}
            placeholder="Entrez le code de vérification"
            {...formik.getFieldProps("token")}
          />
          {formik.touched.token && formik.errors.token && <div className="form-error">{formik.errors.token}</div>}
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
              Vérifier l'email
            </>
          )}
        </button>
      </form>

      {pendingEmail && (
        <div className="mt-6 border-t border-gray-200 pt-6">
          <p className="text-gray-600 mb-4 text-center">Vous n'avez pas reçu l'email?</p>
          <button
            type="button"
            className="w-full btn btn-outline flex items-center justify-center"
            onClick={handleResend}
            disabled={resendDisabled}
          >
            <RefreshCw className={`h-5 w-5 mr-2 ${resendDisabled ? "animate-spin" : ""}`} />
            {resendDisabled ? `Réessayer dans ${countdown} secondes` : "Renvoyer l'email de vérification"}
          </button>
        </div>
      )}

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          <Link
            to="/login"
            className="text-primary-600 hover:text-primary-700 font-medium flex items-center justify-center"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Retour à la connexion
          </Link>
        </p>
      </div>
    </div>
  )
}

export default VerifyEmail
