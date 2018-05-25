// Mongoose for object modeling
var mongoose = require('mongoose');

// Password hashing module
var bcrypt = require('bcrypt');

var examSchema = require('../models/exam');

// Schema for admin
var adminSchema = new mongoose.Schema({
  adminUser: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  adminPassword: {
    type: String,
    required: true
  },
  //exams: [examSchema.schema],
  examCreated: [{
	  type: mongoose.Schema.Types.ObjectId,
	  ref: 'Exam'
  }]
});

// Authenticate input against database
adminSchema.statics.authenticate = function (adminUser, adminPassword, callback) {
  Admin.findOne({ adminUser: adminUser })
    .exec(function (err, user) {
      if (err) {
        return callback(err)
      } else if (!user) {
        var err = new Error('User not found.');
        err.status = 401;
        return callback(err);
      }
	  // Load hash from password DB
      bcrypt.compare(adminPassword, user.adminPassword, function (err, result) {
        if (result === true) {
          return callback(null, user);
        } else {
          return callback();
        }
      })
    });
}

// Prehook
adminSchema.pre('save', function (next) {
  var user = this;
  // Auto-gen a salt and hash before save to DB
  bcrypt.hash(user.adminPassword, 10, function (err, hash) {
    if (err) {
      return next(err);
    }
    user.adminPassword = hash;
    next();
  })
});

var Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;