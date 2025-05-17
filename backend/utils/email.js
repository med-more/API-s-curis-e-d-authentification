const nodemailer = require('nodemailer');

// Create a transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.example.com',
  port: process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || 'user@example.com',
    pass: process.env.SMTP_PASS || 'password'
  }
});

exports.sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;
  
  const mailOptions = {
    from: `"Auth System" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to: email,
    subject: 'Vérification de votre adresse email',
    text: `Merci de vous être inscrit. Veuillez cliquer sur le lien ci-dessous pour vérifier votre adresse email:\n\n${verificationUrl}\n\nSi vous n'avez pas créé de compte, vous pouvez ignorer cet email.\nLe lien expire dans 24 heures.`,
    html: `
      <p>Merci de vous être inscrit. Veuillez cliquer sur le lien ci-dessous pour vérifier votre adresse email:</p>
      <p><a href="${verificationUrl}">${verificationUrl}</a></p>
      <p>Si vous n'avez pas créé de compte, vous pouvez ignorer cet email.</p>
      <p>Le lien expire dans 24 heures.</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

exports.sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
  
  const mailOptions = {
    from: `"Auth System" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to: email,
    subject: 'Réinitialisation de votre mot de passe',
    text: `Vous avez demandé une réinitialisation de mot de passe. Veuillez cliquer sur le lien ci-dessous pour définir un nouveau mot de passe:\n\n${resetUrl}\n\nSi vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email.\nLe lien expire dans 1 heure.`,
    html: `
      <p>Vous avez demandé une réinitialisation de mot de passe. Veuillez cliquer sur le lien ci-dessous pour définir un nouveau mot de passe:</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>
      <p>Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email.</p>
      <p>Le lien expire dans 1 heure.</p>
    `
  };

  await transporter.sendMail(mailOptions);
};