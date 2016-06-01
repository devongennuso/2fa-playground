var express     = require('express');
var router      = express.Router();
var User        = require('../models/user');
var Utility     = require('../utility/utility');
var nodemailer  = require('nodemailer');
var secureCode  = Utility.guid();

router.post('/signup', function(req, res, next) {
  console.log(req.body);

  var user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    password: req.body.password,
    email: req.body.email,
    tcs: req.body.tcs,
    hasSecureSetup: false
  });

  user.save(function(error) {
    if (error) {
      return res.send({status: 500, error: error});
      next();
    }

    res.redirect('/login');
  });
});

router.post('/login', function(req, res, next) {
  console.log('***post body***', req.body);

  // weak input validation check
  User.findOne({email: req.body.email}, 'email password hasSecureSetup', function(error, user) {
    if (error || user == null) {
      return res.send({status: 500, error: 'Unknown user'});
    }

    if (user.password === req.body.password) {
      console.log('***returned user***', user);

      // session flow
      if (req.session.currentUser != null) {
        if (req.session.currentUser.hasSecureSetup) {
          if (req.session.currentUser.secureCode === req.body.secureCode) {
            User.update(
              {email: req.session.currentUser.email},
              {$set: {hasSecureSetup: true}},
              function(error, user) {
                console.log('*****', error, '******', user);
                if (error != null) {
                  return res.send({status: 500, error: 'error updating user'});
                }
            });

            return res.redirect('/secure-setup-success');
          } else {
            res.send({status: 500, error: 'Bad Secure Code'});
          }
        }
      }

      // login flow
      if (user.hasSecureSetup != true) { // has secure setup in User Model
        req.session.currentUser = {
          email: user.email,
          hasSecureSetup: user.hasSecureSetup
        }
        return res.redirect('/verify-secure-setup');
      } else if (user.hasSecureSetup) {
        return res.redirect('/secure-setup-success');
      } else {
        return res.redirect('/login');
      }

    }
  });
});

router.post('/verify-secure-setup', function(req, res, next) {
  // weak input validation check
  User.findOne({email: req.body.email}, 'email', function(error, user) {
    if (error || user == null) {
      return res.send({status: 500, error: 'Unknown user'});
      next();
    }

    var mailData = {
      from: 'your@email.com',
      to: 'your@email.com', // or req.session.currentUser.email
      subject: 'Secure Code',
      text: 'Your Secure Sign-In Code: ' + secureCode
    };

    var transporter = nodemailer.createTransport('smtps://user%40gmail.com:password@stmp.gmail.com');
    transporter.sendMail(mailData, function(error, info) {
      if (error) {
        console.log(error);
        req.session.currentUser.hasSecureSetup = false;
        return res.send({status: 500, error: 'Unknown error'});
      }

      req.session.currentUser.secureCode = secureCode;
      req.session.currentUser.hasSecureSetup = true;

      console.log('email status', info);
      res.redirect('/login');
    });
  });
});


module.exports = router;
