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