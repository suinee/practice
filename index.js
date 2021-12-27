const express=require('express')//모듈 가져오기
const mongoose=require('mongoose')
const methodOverride = require('method-override')
const flash=require("connect-flash")
const session=require("express-session")
const passport=require("./config/passport")
const app = express()//어플리케이션 생성

// DB setting
mongoose.connect(process.env.MONGO_DB);
const db = mongoose.connection; 

db.once('open', function(){
  console.log('DB connected');
})
db.on('error', function(err){
  console.log('DB ERROR : ', err);
});

//other setting
app.set('view engine','ejs')//템플릿 엔진
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(flash());
app.use(session({secret:'MySecret', resave:true, saveUninitialized:true}));
app.use(passport.initialize())
app.use(passport.session())

//custom middlewares
app.use(function(req,res,next){
  res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.currentUser = req.user;
  next();
})

//routes
app.use('/', require('./routes/home'));
app.use('/posts', require('./routes/posts'))
app.use('/contacts', require('./routes/contacts'));
//app.use('/home', require('./routes/home'))
app.use('/users', require('./routes/users'))



//port setting
const server=app.listen(3000, ()=>{
  console.log('Start Server : localhost:3000')
})