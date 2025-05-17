const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');

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