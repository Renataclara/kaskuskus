const express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session')

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(session({
  secret: 'hacktiv8',
  resave: false,
  saveUninitialized: true,
  cookie: {}
}))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

const home = require('./routers/home')
const signup = require('./routers/signup')
const topic = require('./routers/topic')

app.use('/', home);
app.use('/signup', signup);

app.use((req, res, next) => {
  if (req.session.user) { // undefined
    next()
  } else {
    res.render('home', {title:'login', msg: 'anda harus login'})
  }
});

app.use('/topics', topic);



app.listen(3002);