var express = require('express');
var router = express.Router();
var path = require('path');
var admin = require('../models/admin');
var bio = require('../models/biometric');
var exa = require('../models/exam');
var dude = require('../models/user');
// Password hashing module
var bcrypt = require('bcrypt');

// GET route for reading data, frontend
router.get('/', function (req, res, next) {
	return res.sendFile(path.join(__dirname + '/public/index.html'));
});

// GET Create default username
// For testing purposes
router.get('/default', function (req, res, next) {
	var adminDefault = {
		adminUser: 'admin',
		adminPassword: 'admin'
	}
	
	admin.create(adminDefault, function (error, user) {
		if (error) {
			console.log(error);
			return res.redirect('/');
		}
		else {
			return res.redirect('/');
		}
	});
});

// POST route for checking login
router.post('/', function (req, res, next) {
  if (req.body.loginadmin && req.body.loginpw) {
	  admin.authenticate(req.body.loginadmin, req.body.loginpw, function (error, user) {
      if (error || !user) {
		// Replace with error page
        var err = new Error('Incorrect username or password!');
        err.status = 401;
        return next(err);
		//return res.sendFile(path.join(__dirname, '../public/home.html'));
      } else {
        req.session.userId = user._id;
        return res.redirect('/home');
      }
    });
  } else {
	  // For postman testing
	  var err = new Error('Please enter all fields!');
	  err.status = 400;
      return next(err);
  }
});

// GET route after login
router.get('/home', function (req, res, next) {
  // Checks for session token
  admin.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          // Redirects to login page
		  return res.redirect('/');
        } else {
		  return res.render('home.ejs', {userName : user.adminUser});
        }
      }
    });
});

// Main Content //

// GET List of admins
router.get('/home/getadmin', function (req, res, next) {
	admin.findById(req.session.userId).exec(function (error, user) {
		if (error) return next(error);
		else {
			if (user === null) return res.redirect('/');
			else {
				admin.find( {} ).exec(function (err, result) {
					if (err) {
						var err = new Error('No records!');
						err.status = 404;
						return next(err);
					}
					else return res.json(result);
				});
			}
		}
	});
});

router.get('/home/getadmin/:id?', function (req, res, next) {
	admin.findById(req.session.userId).exec(function (error, user) {
		if (error) return next(error);
		else {
			if (user === null) return res.redirect('/');
			else {
				admin.find( {} ).exec(function (err, result) {
					if (err) {
						var err = new Error('No records!');
						err.status = 404;
						return next(err);
					}
					else return res.json(result[req.params.id]);
				});
			}
		}
	});
});

// GET List of users
router.get('/home/getuser', function (req, res, next) {
	admin.findById(req.session.userId).exec(function (error, user) {
		if (error) return next(error);
		else {
			if (user === null) return res.redirect('/');
			else {
				dude.find( {} ).exec(function (err, result) {
					if (err) {
						var err = new Error('No records!');
						err.status = 404;
						return next(err);
					}
					else return res.json(result);
				});
			}
		}
	});
});

router.get('/home/getuser/:id?', function (req, res, next) {
	admin.findById(req.session.userId).exec(function (error, user) {
		if (error) return next(error);
		else {
			if (user === null) return res.redirect('/');
			else {
				dude.find( {} ).exec(function (err, result) {
					if (err) {
						var err = new Error('No records!');
						err.status = 404;
						return next(err);
					}
					else return res.json(result[req.params.id]);
				});
			}
		}
	});
});

// GET List of exams
router.get('/home/getexam', function (req, res, next) {
	admin.findById(req.session.userId).exec(function (error, user) {
		if (error) return next(error);
		else {
			if (user === null) return res.redirect('/');
			else {
				exa.find( {} ).exec(function (err, result) {
					if (err) {
						var err = new Error('No records!');
						err.status = 404;
						return next(err);
					}
					else return res.json(result);
				});
			}
		}
	});
});

router.get('/home/getexam/:id?', function (req, res, next) {
	admin.findById(req.session.userId).exec(function (error, user) {
		if (error) return next(error);
		else {
			if (user === null) return res.redirect('/');
			else {
				exa.find( {} ).exec(function (err, result) {
					if (err) {
						var err = new Error('No records!');
						err.status = 404;
						return next(err);
					}
					else return res.json(result[req.params.id]);
				});
			}
		}
	});
});

// GET Population, ID is Object
router.get('/home/getuserPop/:id?', function (req, res, next) {
	admin.findById(req.session.userId).exec(function (error, user) {
		if (error) return next(error);
		else {
			if (user === null) return res.redirect('/');
			else {
				dude.findById(req.params.id).populate('examAssign').exec(function (err, result) {
					if (err) {
						var err = new Error('No records!');
						err.status = 404;
						return next(err);
					}
					else{
						return res.json(result);
					}						
				});
			}
		}
	});
});

router.get('/home/getexamPop/:id?', function (req, res, next) {
	admin.findById(req.session.userId).exec(function (error, user) {
		if (error) return next(error);
		else {
			if (user === null) return res.redirect('/');
			else {
				exa.findById(req.params.id).populate('userAssign').exec(function (err, result) {
					if (err) {
						var err = new Error('No records!');
						err.status = 404;
						return next(err);
					}
					else{
						return res.json(result);
					}						
				});
			}
		}
	});
});

// POST route for insert admin
router.post('/home/addadmin', function (req, res, next) {
	admin.findById(req.session.userId).exec(function (error, user) {
		if (error) return next(error);
		else {
			if (user === null) return res.redirect('/');
			else {
				var adminData = {
					adminUser: req.body.au,
					adminPassword: req.body.ap
				}
				admin.create(adminData, function (error, result) {
					if (error) {
						return res.send('Add admin failed!');
					}
					else{
						return res.send('Admin successfully added!');
					}
				});
			}
		}
	});
});

router.post('/home/adduser', function (req, res, next) {
	admin.findById(req.session.userId).exec(function (error, user) {
		if (error) return next(error);
		else {
			if (user === null) return res.redirect('/');
			else {
				var userData = {
					userEmail: req.body.a,
					userPassword: req.body.b,
					userType: req.body.c,
					accountStatus: req.body.d,
					firstName: req.body.e,
					middleName: req.body.f,
					lastName: req.body.g,
					phoneNum: req.body.h,
					address: req.body.i,
					bioMetrics: {
						faceData: req.body.j,
						photoId: req.body.k,
						keystrokeData: req.body.l,
					}
				}
				dude.create(userData, function (error, result) {
					if (error) {
						return res.send('Add user failed!');
					}
					else{
						return res.send('User successfully added!');
					}
				});
			}
		}
	});
});

// POST route for insert exam
router.post('/home/addexam', function (req, res, next) {
	admin.findById(req.session.userId).exec(function (error, user) {
		if (error) return next(error);
		else {
			if (user === null) return res.redirect('/');
			else {
				var examData = {
					examName: req.body.a,
					className: req.body.b,
					startDate: req.body.c,
					endDate: req.body.d,
					examStatus: req.body.e,
					examLink: req.body.f,
					examOptions: req.body.g,
				}
				exa.create(examData, function (error, result) {
					if (error) {
						return res.send('Add exam failed!');
					}
					else{
						return res.send('Exam successfully added!');
					}
				});
			}
		}
	});
});

// PUT Route for assigning links
router.put('/home/assignuser/:id?', function (req, res, next) {
	admin.findById(req.session.userId).exec(function (error, user) {
		if (error) return next(error);
		else {
			if (user === null) return res.redirect('/');
			else {
				var field = req.body.peace2;
				var assignL = {};
				assignL[field] = req.body.walker2;
				dude.findByIdAndUpdate(req.params.id, {
					$push: assignL
				}).exec(function (err, result) {
					if (err || result === null) {
						return res.send('Link failed! Check your parent/child IDs!');
					}
					else return res.send("Link success!");
				});
			}
		}
	});
});

router.put('/home/assignexam/:id?', function (req, res, next) {
	admin.findById(req.session.userId).exec(function (error, user) {
		if (error) return next(error);
		else {
			if (user === null) return res.redirect('/');
			else {
				var field = req.body.peace2;
				var assignL = {};
				assignL[field] = req.body.walker2;
				exa.findByIdAndUpdate(req.params.id, {
					$push: assignL
				}).exec(function (err, result) {
					if (err || result === null) {
						return res.send('Link failed! Check your parent/child IDs!');
					}
					else return res.send("Link success!");
				});
			}
		}
	});
});

// PUT route for update user
router.put('/home/updateuser/:id?', function (req, res, next) {
	admin.findById(req.session.userId).exec(function (error, user) {
		if (error) return next(error);
		else {
			if (user === null) return res.redirect('/');
			else {
				var field = req.body.peace;
				var update = {};
				if (req.body.peace === 'userPassword') {
					var hash = bcrypt.hashSync(req.body.walker, 10);
					update[field] = hash;
				}
				else{
					update[field] = req.body.walker;
				}
				dude.findByIdAndUpdate(req.params.id, {
					$set: update
				}).exec(function (err, result) {
					if (err || result === null) {
						return res.send('No records found!');
					}
					else return res.send("Update success!");
				});
			}
		}
	});
});

// PUT route for update exam
router.put('/home/updateexam/:id?', function (req, res, next) {
	admin.findById(req.session.userId).exec(function (error, user) {
		if (error) return next(error);
		else {
			if (user === null) return res.redirect('/');
			else {
				var field = req.body.peace;
				var update = {};
				update[field] = req.body.walker;
				exa.findByIdAndUpdate(req.params.id, {
					$set: update
				}).exec(function (err, result) {
					if (err || result === null) {
						return res.send('No records found!');
					}
					else return res.send("Update success!");
				});
			}
		}
	});
});

// Delete route for remove user
router.delete('/home/deleteuser/:id?', function (req, res, next) {
	admin.findById(req.session.userId).exec(function (error, user) {
		if (error) return next(error);
		else {
			if (user === null) return res.redirect('/');
			else {
				dude.findByIdAndRemove(req.params.id).exec(function (err, result) {
					if (err || result === null) {
						return res.send('No records found!');
					}
					else return res.send("Delete success!");
				});
			}
		}
	});
});

// Delete route for remove exam
router.delete('/home/deleteexam/:id?', function (req, res, next) {
	admin.findById(req.session.userId).exec(function (error, user) {
		if (error) return next(error);
		else {
			if (user === null) return res.redirect('/');
			else {
				exa.findByIdAndRemove(req.params.id).exec(function (err, result) {
					if (err || result === null) {
						return res.send('No records found!');
					}
					else return res.send("Delete success!");
				});
			}
		}
	});
});

// GET for logout
router.get('/logout', function (req, res, next) {
  if (req.session) {
    // Delete session object
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});

module.exports = router;