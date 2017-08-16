'use strict'

const express = require('express');
const router = express.Router();
const model = require('../models');


router.get('/', function(req,res){
  model.Topic.findAll({ include: [ model.User ], order: [['createdAt']] })
  .then(result => {
    res.send(result);
    // res.render('topic', {data: result, user_id: req.session.user.id, topic_id: ""});
  })
})

module.exports = router
