var express = require('express');
var router = express.Router();
const usermodel = require("./users")
const postmodel = require("./posts");
const passport = require('passport');

const localStrategy = require("passport-local")
passport.use(new localStrategy(usermodel.authenticate()))
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/profile', isLoggedIn, function (req, res, next) {
  res.send('profile');
});
router.get('/forgot',function (req, res, next) {
  res.send('forgot');
});

router.post('/register', function (req, res) {
  const { email, username, fullname } = req.body;
  const userData = new usermodel({
    email,
    username,
    fullname,
  });

  usermodel.register(userData, req.body.password)
    .then(function () {
      passport.authenticate("local")(req, res, function() {
        res.redirect("/profile")
      });
    })
})

router.post("/login", passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/"
}), function () {
})

router.get('/logout', function (req, res) {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
})

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) 
    return next();
  res.redirect('/')
}
module.exports = router;
