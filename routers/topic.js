'use strict'

const express = require('express');
const router = express.Router();
const model = require('../models');
// include: [ model.User ],

router.get('/', function(req,res){
  model.Topic.findAll({
    order: [['createdAt']],
    include: [
     { model: model.User}
   ]
  })
  .then(result => {
    // console.log(req.session.user.id);
    // res.send(result[0].User.username)
    // res.render('topic', {data: result, user_id: req.session.user.id, topic_id: ""});
    res.render('topic', {data:result, user_id: req.session.user.id});
  })
})

router.post('/', function(req,res){
  model.Topic.create({
    name_topic: req.body.name_topic,
    UserId: req.session.user.id,
    createdAt: new Date(),
    updatedAt: new Date()
    })
    .then( function(){
      res.redirect('/topics');
    })
})


router.get('/edit/:id', function(req, res, next){
  model.Topic.findById(req.params.id)
    .then( function(rows){
      if(rows.UserId != req.session.user.id) {
        res.redirect('/topics')
      }else{
        req.rows = rows;
        next()
      }
    })
  }, function (req, res, next) {
      res.render('topicEdit', {data:req.rows});
});

router.post('/edit/:id', function(req,res){
  model.Topic.update(
  { name_topic: req.body.name_topic,
    updatedAt: new Date()
  }
  ,{
    where: {id: req.params.id}
  });
  res.redirect('/topics')
})

router.get('/delete/:id', function(req, res, next){
  model.Topic.findById(req.params.id)
    .then( function(rows){
      if(rows.UserId != req.session.user.id) {
        res.redirect('/topics')
      }else{

        next()
      }
    })
  }, function (req, res, next) {
    model.Topic.destroy({where: {id : req.params.id}}) // dan yg di studentsubject
    .then( function(){
      model.Post.destroy({where: {TopicId: req.params.id}})
        .then( function(){
        res.redirect('/topics');
      })
    })
  }
);


module.exports = router
