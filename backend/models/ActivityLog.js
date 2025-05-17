const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: ['LOGIN', 'LOGOUT', 'REGISTRATION', 'PASSWORD_CHANGE', 'PASSWORD_RESET', 
           'EMAIL_UPDATE', 'PHONE_UPDATE', 'PROFILE_UPDATE']
  },
  details: {
    type: String
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);
module.exports = ActivityLog;