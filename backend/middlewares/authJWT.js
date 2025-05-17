const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return res.status(401).json({ message: 'Token requis' });

  try {
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.userId = decoded.id;
    req.user = decoded;
    
    const userExists = await User.exists({ _id: decoded.id });
    if (!userExists) {
      return res.status(401).json({ message: 'Utilisateur non trouvé' });
    }
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token invalide ou expiré' });
  }
};