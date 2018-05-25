// Mongoose for object modeling
var mongoose = require('mongoose');

// Schema for exam
var examSchema = new mongoose.Schema({
  examName: {
    type: String,
    unique: true,
	required: true
  },
  className: {
    type: String
  },
  startDate: {
    type: String
  },
  endDate: {
    type: String
  },
  examStatus: {
    type: String
  },
  examLink: {
    type: String
  },
  examOptions: {
    type: String
  },
  //examSessions: [examSessionSchema],
  userAssign: [{
	  type: mongoose.Schema.Types.ObjectId,
	  ref: 'User'
  }],
  examCreator: [{
	  type: mongoose.Schema.Types.ObjectId,
	  ref: 'Admin'
  }]
});

var Exam = mongoose.model('Exam', examSchema);
module.exports = Exam;