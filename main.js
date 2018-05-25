var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');

// For serving dynamic pages
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname + '/public/views')); 

// Stores session in DB
var MongoStore = require('connect-mongo')(session);

// Connect to MongoDB
mongoose.connect('mongodb://localhost/jly');
var db = mongoose.connection;

// Handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // We're connected!
});

// Use sessions for tracking logins
app.use(session({
  // Secret is generator
  secret: 'myGraduate',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db,
	ttl: 1 * 2 * 60 * 60 // 2 Hour Session
  })
}));

// Parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Serve static files from template
app.use(express.static(__dirname + '/public'));

// Include routes
// This route path only works if main is at root
var routes = require('./routes/router');
app.use('/', routes);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('File Not Found.');
  err.status = 404;
  next(err);
});

// Error handler
// Define as the last app.use callback
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});

// Listen on port 9999
app.listen(9999, function () {
  console.log('Express app listening on port 9999');
});