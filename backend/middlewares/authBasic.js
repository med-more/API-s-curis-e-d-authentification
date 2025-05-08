const User = require('../models/User');
const bcrypt = require('bcrypt');

module.exports = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Basic ')) return res.status(401).json({ error: 'Auth requis' });

  const base64 = header.split(' ')[1];
  const [email, password] = Buffer.from(base64, 'base64').toString().split(':');

  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Identifiants invalides' });
  }

  req.userId = user._id;
  next();
};
