// Mongoose for object modeling
var mongoose = require('mongoose');

// Password hashing module
var bcrypt = require('bcrypt');

var biometricsSchema = require('../models/biometric');

// Schema for user
var userSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  userPassword: {
    type: String,
    required: true
  },
  userType: {
    type: String
  },
  accountStatus: {
    type: String
  },
  firstName: {
    type: String
  },
  middleName: {
    type: String
  },
  lastName: {
    type: String
  },
  phoneNum: {
    type: Number
  },
  address: {
    type: String
  },
  bioMetrics: [biometricsSchema.schema],
  examAssign: [{
	  type: mongoose.Schema.Types.ObjectId,
	  ref: 'Exam'
  }]
});

// Prehook
userSchema.pre('save', function (next) {
  var user = this;
  // Auto-gen a salt and hash before save to DB
  bcrypt.hash(user.userPassword, 10, function (err, hash) {
    if (err) {
      return next(err);
    }
    user.userPassword = hash;
    next();
  })
});

var User = mongoose.model('User', userSchema);
module.exports = User;