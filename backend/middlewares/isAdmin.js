module.exports = (req, res, next) => {
  if (!req.userId) {
    return res.status(401).json({ message: 'Authentification requise' });
  }
  
  if (req.user && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Accès non autorisé' });
  }
  
  next();
};