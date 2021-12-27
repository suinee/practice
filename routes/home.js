const express=require('express')
const router=express.Router()
const passport=require('../config/passport')

router.get('/', function(req, res){
  res.render('home/main');
});

router.get('/about', function(req, res){
  res.render('home/about');
});

router.get('/login',function(req,res){
  const username=req.flash('username')[0];
  const errors=req.flash('errors')[0]||{};
  res.render('home/login',{
    username:username,
    errors:errors
  })
})

router.post('/login',
  function(req,res,next){
    const errors = {};
    const isValid = true;

    if(!req.body.username){
      isValid = false;
      errors.username = 'Username is required!';
    }
    if(!req.body.password){
      isValid = false;
      errors.password = 'Password is required!';
    }

    if(isValid){
      next();
    }
    else {
      req.flash('errors',errors);
      res.redirect('/login');
    }
  },
  passport.authenticate('local-login', {
    successRedirect : '/',
    failureRedirect : '/login'
  }
));

// Logout
router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

module.exports=router;