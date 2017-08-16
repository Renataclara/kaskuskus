'use strict'

const express = require('express');
const router = express.Router();
const model = require('../models');
// include: [ model.User ],

router.get('/', function(req,res){
  model.Topic.findAll({ order: [['createdAt']] })
  .then(result => {
    // console.log(req.session.user.id);
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
// router.get('/edit/:id', function(req, res, next){
//   model.Topic.findById(req.params.id)
//     .then( function(rows){
//       res.render('topicEdit', {data:rows});
//     })
// });

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

router.get('/posts/:id', function(req,res){
  model.Topic.findById(req.params.id)
  .then( function(rows){
    model.Post.findAll({
      attributes: ['id', 'TopicId', 'UserId', 'name_post','createdAt', 'updatedAt' ],
      where: {TopicId:req.params.id}
    })
    .then( function(rows2){
      // res.send(rows2)
    res.render('post', {data_topic:rows, data_post:rows2, user_id: req.session.user.id});
    })
  })
})

router.post('/posts/:id', function(req,res){
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

router.get('/posts/:idtp/edit/:idpt', function(req, res, next){
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

router.post('/posts/:idtp/edit/:idpt', function(req,res){
  model.Post.update(
  { name_post: req.body.name_post,
    updatedAt: new Date()
  }
  ,{
    where: {id: req.params.idpt}
  });
  res.redirect(`/topics/posts/${req.params.idtp}`)
})

// router.get('/posts/:idtp/edit/:idpt', function(req, res, next){
//   model.Post.findAll({
//     attributes: ['id', 'TopicId', 'UserId', 'name_post' ],
//     where: {id:req.params.idpt}
//   })
//   .then( function(rows){
//       if(rows[0].UserId != req.session.user.id) {
//         res.redirect(`/topics/posts/${req.params.idtp}`)
//       }else{
//         next()
//       }
//     })
//   }, function (req, res, next) {
//       model.Post.findAll
//       ({  attributes:['id', 'TopicId', 'UserId', 'name_post' ],
//           where: {id: req.params.idpt}
//       })
//         .then( function(rows){
//           // res.send(rows);
//           res.render('postEdit', {data:rows[0]});
//         })
//     }
// );

router.get('/posts/:idtp/delete/:idpt', function(req, res, next){
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
