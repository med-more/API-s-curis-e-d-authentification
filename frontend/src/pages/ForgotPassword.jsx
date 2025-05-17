import { useFormik } from "formik"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { Mail, ArrowLeft, Send } from "lucide-react"
import { useState } from "react"
import { forgotPasswordSchema } from "../utils/validation"

const ForgotPassword = () => {
  const { forgotPassword } = useAuth()
  const [emailSent, setEmailSent] = useState(false)
  const [sentEmail, setSentEmail] = useState("")

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: forgotPasswordSchema,
    onSubmit: async (values) => {
      try {
        const success = await forgotPassword(values.email)
        if (success) {
          setEmailSent(true)
          setSentEmail(values.email)
        }
      } catch (error) {
        console.error("Forgot password error:", error)
      }
    },
  })

  if (emailSent) {
    return (
      <div className="max-w-md mx-auto card p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
            <Send className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold">Email envoyé!</h1>
          <p className="text-gray-600 mt-4">
            Nous avons envoyé un email à <strong>{sentEmail}</strong> avec des instructions pour réinitialiser votre mot
            de passe.
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-gray-600 text-sm">
            Si vous ne recevez pas l'email dans quelques minutes, vérifiez votre dossier spam ou essayez de soumettre à
            nouveau le formulaire avec la bonne adresse email.
          </p>

          <div className="flex flex-col space-y-3 mt-6">
            <button
              type="button"
              className="w-full btn btn-outline flex items-center justify-center"
              onClick={() => setEmailSent(false)}
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Revenir au formulaire
            </button>

            <Link to="/login" className="w-full btn btn-primary flex items-center justify-center">
              Retour à la connexion
            </Link>
          </div>
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
        <h1 className="text-2xl font-bold">Mot de passe oublié?</h1>
        <p className="text-gray-500 mt-2">
          Entrez votre adresse email et nous vous enverrons des instructions pour réinitialiser votre mot de passe.
        </p>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
            Adresse email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              className={`form-input pl-10 ${formik.touched.email && formik.errors.email ? "border-red-500" : ""}`}
              placeholder="Entrez votre adresse email"
              {...formik.getFieldProps("email")}
            />
          </div>
          {formik.touched.email && formik.errors.email && <div className="form-error">{formik.errors.email}</div>}
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
              <Send className="h-5 w-5 mr-2" />
              Envoyer les instructions
            </>
          )}
        </button>
      </form>

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

export default ForgotPassword
