const User = require("../models/User");
const ActivityLog = require("../models/ActivityLog");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendVerificationEmail, sendPasswordResetEmail } = require("../utils/email");
const { sendPhoneVerificationCode } = require("../utils/sms");

const logActivity = async (userId, action, details, req) => {
  try {
    await ActivityLog.create({
      userId,
      action,
      details,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });
  } catch (error) {
    console.error("Error logging activity:", error);
  }
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;
    
    const existingUser = await User.findOne({ 
      $or: [{ email }, { phone }]
    });
    
    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ 
          message: 'Cet email est déjà utilisé',
          field: 'email'
        });
      }
      if (existingUser.phone === phone) {
        return res.status(400).json({ 
          message: 'Ce numéro de téléphone est déjà utilisé',
          field: 'phone'
        });
      }
    }
    
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    const emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 heures
    
    const user = await User.create({
      name,
      email,
      phone,
      password,
      emailVerificationToken,
      emailVerificationExpires
    });
    
    try {
      console.log(`Email de vérification envoyé à ${user.email} avec le token: ${emailVerificationToken}`);
    } catch (error) {
      console.error("Erreur d'envoi d'email:", error);
    }
    
    await logActivity(user._id, 'REGISTRATION', 'Nouvel utilisateur inscrit', req);
    
    res.status(201).json({ 
      message: 'Inscription réussie. Veuillez vérifier votre email.',
      requiresEmailVerification: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Erreur lors de l\'inscription:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Données invalides',
        errors: Object.values(err.errors).map(e => ({
          field: e.path,
          message: e.message
        }))
      });
    }
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }
    
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    req.session.user = user._id;
    
    await logActivity(user._id, 'LOGIN', 'Connexion réussie', req);
    
    res.json({
      token,
      message: 'Connexion réussie',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        emailVerified: user.emailVerified,
        phoneVerified: user.phoneVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    const userId = req.userId || req.session?.user;
    
    if (userId) {
      await logActivity(userId, 'LOGOUT', 'Déconnexion réussie', req);
    }
    
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.json({ message: 'Déconnexion réussie' });
    });
  } catch (err) {
    next(err);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const userId = req.userId || req.session?.user;
    const user = await User.findById(userId);
    
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      emailVerified: user.emailVerified,
      phoneVerified: user.phoneVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });
  } catch (err) {
    next(err);
  }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;
    
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({ message: 'Token de vérification invalide ou expiré' });
    }
    
    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();
    
    await logActivity(user._id, 'EMAIL_UPDATE', 'Email vérifié', req);
    
    res.json({ message: 'Email vérifié avec succès' });
  } catch (err) {
    next(err);
  }
};

exports.resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Aucun compte associé à cet email' });
    }
    
    if (user.emailVerified) {
      return res.status(400).json({ message: 'Cet email est déjà vérifié' });
    }
    
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    const emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; 
    user.emailVerificationToken = emailVerificationToken;
    user.emailVerificationExpires = emailVerificationExpires;
    await user.save();
    
    try {
      console.log(`Email de vérification renvoyé à ${user.email} avec le token: ${emailVerificationToken}`);
    } catch (error) {
      console.error("Erreur d'envoi d'email:", error);
    }
    
    res.json({ message: 'Email de vérification renvoyé avec succès' });
  } catch (err) {
    next(err);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Aucun compte associé à cet email' });
    }
    
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetPasswordExpires = Date.now() + 60 * 60 * 1000; 
    
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetPasswordExpires;
    await user.save();
    
    try {
      console.log(`Email de réinitialisation envoyé à ${user.email} avec le token: ${resetToken}`);
    } catch (error) {
      console.error("Erreur d'envoi d'email:", error);
    }
    
    res.json({ message: 'Instructions de réinitialisation envoyées à votre email' });
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({ message: 'Token de réinitialisation invalide ou expiré' });
    }
    
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    
    await logActivity(user._id, 'PASSWORD_RESET', 'Mot de passe réinitialisé', req);
    
    res.json({ message: 'Mot de passe réinitialisé avec succès' });
  } catch (err) {
    next(err);
  }
};

exports.verifyPhone = async (req, res, next) => {
  try {
    const { code, phone } = req.body;
    const userId = req.userId || req.session?.user;
    
    const user = await User.findOne({
      _id: userId,
      phone,
      phoneVerificationCode: code,
      phoneVerificationExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({ message: 'Code de vérification invalide ou expiré' });
    }
    
    user.phoneVerified = true;
    user.phoneVerificationCode = undefined;
    user.phoneVerificationExpires = undefined;
    await user.save();
    
    await logActivity(user._id, 'PHONE_UPDATE', 'Téléphone vérifié', req);
    
    res.json({ message: 'Numéro de téléphone vérifié avec succès' });
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const userId = req.userId || req.session?.user;
    const { name, email, phone, currentPassword, newPassword } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    if (email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Cet email est déjà utilisé' });
      }
      
      const emailVerificationToken = crypto.randomBytes(32).toString('hex');
      const emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 heures
      
      user.email = email;
      user.emailVerified = false;
      user.emailVerificationToken = emailVerificationToken;
      user.emailVerificationExpires = emailVerificationExpires;
      
      try {
        console.log(`Email de vérification envoyé à ${user.email} avec le token: ${emailVerificationToken}`);
      } catch (error) {
        console.error("Erreur d'envoi d'email:", error);
      }
    }
    
    if (phone !== user.phone) {
      const existingUser = await User.findOne({ phone });
      if (existingUser) {
        return res.status(400).json({ message: 'Ce numéro de téléphone est déjà utilisé' });
      }
      
      const phoneVerificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      const phoneVerificationExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
      
      user.phone = phone;
      user.phoneVerified = false;
      user.phoneVerificationCode = phoneVerificationCode;
      user.phoneVerificationExpires = phoneVerificationExpires;
      
      try {
        console.log(`SMS de vérification envoyé à ${user.phone} avec le code: ${phoneVerificationCode}`);
      } catch (error) {
        console.error("Erreur d'envoi de SMS:", error);
      }
    }
    
    user.name = name;
    
    if (currentPassword && newPassword) {
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ message: 'Mot de passe actuel incorrect' });
      }
      
      user.password = newPassword;
      
      await logActivity(user._id, 'PASSWORD_CHANGE', 'Mot de passe modifié', req);
    }
    
    await user.save();
    
    await logActivity(user._id, 'PROFILE_UPDATE', 'Profil mis à jour', req);
    
    res.json({
      message: 'Profil mis à jour avec succès',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        emailVerified: user.emailVerified,
        phoneVerified: user.phoneVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (err) {
    next(err);
  }
};