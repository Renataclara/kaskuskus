'use strict'

const express = require('express');
const router = express.Router();
const model = require('../models');
// include: [ model.User ],

router.get('/:id', function(req,res){
  model.Topic.findById(req.params.id)
  .then( function(rows){
    model.Post.findAll({
      attributes: ['id', 'TopicId', 'UserId', 'name_post','createdAt', 'updatedAt' ],
      order: [['createdAt']],
      include: [
       { model: model.User}
      ],
      where: {TopicId:req.params.id}
    })
    .then( function(rows2){
      // res.send(rows2)
    res.render('post', {data_topic:rows, data_post:rows2, user_id: req.session.user.id});
    })
  })
})

router.post('/:id', function(req,res){
  model.Post.create({
    name_post: req.body.name_post,
    TopicId: req.params.id,
    UserId: req.session.user.id,
    createdAt: new Date(),
    updatedAt: new Date()
  })
  .then( function(){
    res.redirect(`/topics/posts/${req.params.id}`);
  })
})

router.get('/:idtp/edit/:idpt', function(req, res, next){
  model.Post.findAll({
    attributes: ['id', 'TopicId', 'UserId', 'name_post' ],
    where: {id:req.params.idpt}
  })
  .then( function(rows){
      if(rows[0].UserId != req.session.user.id) {
        res.redirect(`/topics/posts/${req.params.idtp}`)
      }else{
        next()
      }
    })
  }, function (req, res, next) {
      model.Post.findAll
      ({  attributes:['id', 'TopicId', 'UserId', 'name_post' ],
          where: {id: req.params.idpt}
      })
        .then( function(rows){
          // res.send(rows);
          res.render('postEdit', {data:rows[0]});
        })
    }
);

router.post('/:idtp/edit/:idpt', function(req,res){
  model.Post.update(
  { name_post: req.body.name_post,
    updatedAt: new Date()
  }
  ,{
    where: {id: req.params.idpt}
  });
  res.redirect(`/topics/posts/${req.params.idtp}`)
})

router.get('/:idtp/delete/:idpt', function(req, res, next){
  model.Post.findAll({
    attributes: ['id', 'TopicId', 'UserId', 'name_post' ],
    where: {id:req.params.idpt}
  })
  .then( function(rows){
      if(rows[0].UserId != req.session.user.id) {
        res.redirect(`/topics/posts/${req.params.idtp}`)
      }else{
        next()
      }
    })
  }, function (req, res, next) {
  model.Post.destroy({where: {id: req.params.idpt}})
    .then( function(){
    res.redirect(`/topics/posts/${req.params.idtp}`);
  })
});


module.exports = router
