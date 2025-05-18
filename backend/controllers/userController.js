const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');

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

exports.getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const users = await User.find()
      .select('-password -emailVerificationToken -emailVerificationExpires -phoneVerificationCode -phoneVerificationExpires -resetPasswordToken -resetPasswordExpires')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    const total = await User.countDocuments();
    
    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalUsers: total
    });
  } catch (err) {
    next(err);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -emailVerificationToken -emailVerificationExpires -phoneVerificationCode -phoneVerificationExpires -resetPasswordToken -resetPasswordExpires');
    
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    res.json(user);
  } catch (err) {
    next(err);
  }
};

exports.searchUsers = async (req, res, next) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ message: 'Paramètre de recherche requis' });
    }
    
    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { phone: { $regex: query, $options: 'i' } }
      ]
    }).select('-password -emailVerificationToken -emailVerificationExpires -phoneVerificationCode -phoneVerificationExpires -resetPasswordToken -resetPasswordExpires');
    
    res.json(users);
  } catch (err) {
    next(err);
  }
};

exports.getActivityLogs = async (req, res, next) => {
  try {
    const userId = req.query.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    let query = {};
    if (userId) {
      query.userId = userId;
    }
    
    const logs = await ActivityLog.find(query)
      .populate('userId', 'name email')
      .skip(skip)
      .limit(limit)
      .sort({ timestamp: -1 });
    
    const total = await ActivityLog.countDocuments(query);
    
    res.json({
      logs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalLogs: total
    });
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, phone, role } = req.body;
    
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    // Vérifier si l'email est déjà utilisé par un autre utilisateur
    if (email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Cet email est déjà utilisé' });
      }
      user.email = email;
      user.emailVerified = false;
    }
    
    // Vérifier si le numéro de téléphone est déjà utilisé par un autre utilisateur
    if (phone !== user.phone) {
      const existingUser = await User.findOne({ phone });
      if (existingUser) {
        return res.status(400).json({ message: 'Ce numéro de téléphone est déjà utilisé' });
      }
      user.phone = phone;
      user.phoneVerified = false;
    }
    
    user.name = name;
    if (role) {
      user.role = role;
    }
    
    await user.save();
    
    await logActivity(user._id, 'PROFILE_UPDATE', 'Profil mis à jour par l\'administrateur', req);
    
    res.json({
      message: 'Utilisateur mis à jour avec succès',
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

exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    await user.deleteOne();
    
    await logActivity(req.userId, 'USER_DELETE', `Utilisateur ${user.name} supprimé`, req);
    
    res.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (err) {
    next(err);
  }
};