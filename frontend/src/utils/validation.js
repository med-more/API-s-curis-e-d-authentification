import * as Yup from "yup"

// Phone regex pattern - matches international formats
const phoneRegExp = /^(\+?\d{1,3}[- ]?)?\d{9,15}$/

// Password regex - at least one uppercase, one lowercase, one number, min 8 chars
const passwordRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/

// Login validation schema
export const loginSchema = Yup.object({
  email: Yup.string().email("Adresse email invalide").required("L'email est obligatoire"),
  password: Yup.string()
    .required("Le mot de passe est obligatoire")
    .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
})

// Registration validation schema
export const registerSchema = Yup.object({
  name: Yup.string()
    .required("Le nom est obligatoire")
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(50, "Le nom ne peut pas dépasser 50 caractères"),
  email: Yup.string().email("Adresse email invalide").required("L'email est obligatoire"),
  phone: Yup.string()
    .matches(phoneRegExp, "Numéro de téléphone invalide")
    .required("Le numéro de téléphone est obligatoire"),
  password: Yup.string()
    .required("Le mot de passe est obligatoire")
    .matches(
      passwordRegExp,
      "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre",
    ),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Les mots de passe doivent correspondre")
    .required("Veuillez confirmer votre mot de passe"),
  acceptTerms: Yup.boolean().oneOf([true], "Vous devez accepter les conditions d'utilisation"),
})

// Profile update validation schema
export const profileUpdateSchema = Yup.object({
  name: Yup.string()
    .required("Le nom est obligatoire")
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(50, "Le nom ne peut pas dépasser 50 caractères"),
  email: Yup.string().email("Adresse email invalide").required("L'email est obligatoire"),
  phone: Yup.string()
    .matches(phoneRegExp, "Numéro de téléphone invalide")
    .required("Le numéro de téléphone est obligatoire"),
  currentPassword: Yup.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  newPassword: Yup.string()
    .test(
      "password-check",
      "Le nouveau mot de passe est obligatoire si vous changez de mot de passe",
      function (value) {
        return !this.parent.currentPassword || (this.parent.currentPassword && value)
      },
    )
    .matches(
      passwordRegExp,
      "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre",
    ),
  confirmNewPassword: Yup.string().test("password-match", "Les mots de passe doivent correspondre", function (value) {
    return !this.parent.newPassword || value === this.parent.newPassword
  }),
})

// Forgot password validation schema
export const forgotPasswordSchema = Yup.object({
  email: Yup.string().email("Adresse email invalide").required("L'email est obligatoire"),
})

// Reset password validation schema
export const resetPasswordSchema = Yup.object({
  password: Yup.string()
    .required("Le mot de passe est obligatoire")
    .matches(
      passwordRegExp,
      "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre",
    ),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Les mots de passe doivent correspondre")
    .required("Veuillez confirmer votre mot de passe"),
})

// Phone verification schema
export const phoneVerificationSchema = Yup.object({
  code: Yup.string()
    .required("Le code est obligatoire")
    .matches(/^\d{4,6}$/, "Le code doit contenir entre 4 et 6 chiffres"),
})

// Email verification schema
export const emailVerificationSchema = Yup.object({
  token: Yup.string().required("Le token est obligatoire"),
})
