var express = require('express');
var router  = express.Router();

router.get('/', function(req, res, next) {
  res.render('signup');
});

router.get('/login', function(req, res, next) {
  if (req.session.currentUser == null) {
    res.render('login');
  } else {
    res.render('login', {hasSecureSetup: req.session.currentUser.hasSecureSetup});
  }
});

router.get('/verify-secure-setup', function(req, res, next) {
  res.render('verify-secure-setup')
});

router.get('/secure-setup', function(req, res, next) {
  res.render('secure-setup');
});

router.get('/secure-setup-success', function(req, res, next) {
  res.render('secure-setup-success')
});

module.exports = router;
