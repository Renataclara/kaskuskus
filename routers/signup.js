var express = require('express')
var router = express.Router();
var Model = require('../models');
const crypto = require('crypto');
const hash = require('../helpers/hash')

router.get('/', function(req,res){
  res.render('signup', {title: 'Signup', msg: ''})
})

router.post('/', function(req,res){
  Model.User.create({
    username: req.body.username,
    password: req.body.password
  })
  .then(function(){
    res.redirect('/login')
  })
})


module.exports = router;
