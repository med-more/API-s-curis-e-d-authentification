const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res, next) => {
    try {
      const { name, email, password } = req.body;
      const exists = await User.findOne({ email });
      if (exists) return res.status(400).json({ error: 'Email déjà utilisé' });
  
      const user = await User.create({ name, email, password });
      res.status(201).json({ message: 'Inscription réussie' });
    } catch (err) {
      next(err);
    }
  };

  exports.login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: 'Identifiants invalides' });
      }
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      req.session.user = user._id;
  
      res.json({ token, message: 'Connexion réussie' });
    } catch (err) {
      next(err);
    }
  };