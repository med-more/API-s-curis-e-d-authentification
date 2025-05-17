const { body, validationResult } = require("express-validator");

const phoneRegExp = /^(\+?\d{1,3}[- ]?)?\d{9,15}$/;

const passwordRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;

exports.registerValidator = [
  body('name')
    .notEmpty().withMessage('Le nom est requis')
    .isLength({ min: 2 }).withMessage('Le nom doit contenir au moins 2 caractères')
    .isLength({ max: 50 }).withMessage('Le nom ne doit pas dépasser 50 caractères'),
  body('email')
    .isEmail().withMessage('Email invalide')
    .notEmpty().withMessage('L\'email est requis'),
  body('phone')
    .notEmpty().withMessage('Le numéro de téléphone est requis')
    .matches(phoneRegExp).withMessage('Format de téléphone invalide. Utilisez le format international (ex: +33612345678)'),
  body('password')
    .notEmpty().withMessage('Le mot de passe est requis')
    .matches(passwordRegExp).withMessage('Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

exports.loginValidator = [
  body('email')
    .isEmail().withMessage('Email invalide')
    .notEmpty().withMessage('L\'email est requis'),
  body('password')
    .notEmpty().withMessage('Le mot de passe est requis'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
]; 