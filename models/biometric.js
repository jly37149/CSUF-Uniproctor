// Mongoose for object modeling
var mongoose = require('mongoose');

// Schema for biometrics
// Strings are placeholder
var biometricsSchema = new mongoose.Schema({
  faceData: {
    type: String
  },
  photoId: {
    type: String
  },
  keystrokeData: {
    type: String
  }
});

var Biometric = mongoose.model('Biometric', biometricsSchema);
module.exports = Biometric;