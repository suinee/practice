const express  = require('express');
const router = express.Router();
const Post = require('../models/Post');
const util=require('../util');

// Index 
router.get('/', function(req, res){
  Post.find({})       
  .populate('author')
  .sort('-createdAt')            
  .exec(function(err, posts){    
    if(err) return res.json(err);
    res.render('posts/index', {posts:posts});
  });
});

// New
router.get('/new', function(req, res){
  const post=req.flash('post')[0]||{};
  const errors=req.flash('errors')[0]||{};
  res.render('posts/new',{post:post, errors:errors});
});

// create
router.post('/', function(req, res){
  req.body.author = req.user._id;
  Post.create(req.body, function(err, post){
    if(err){
      req.flash('post',req.body);
      req.flash('errors',util.parseError(err));
      return res.redirect('/posts/new');
    }
    res.redirect('/posts');
  });
});

// show
router.get('/:id', function(req, res){
  Post.findOne({_id:req.params.id})
  .populate('author')            
  .exec(function(err, post){     
    if(err) return res.json(err);
    res.render('posts/show', {post:post});
  });
});

// edit
router.get('/:id/edit', (req, res) => {
    const post = req.flash('post')[0];
    const errors = req.flash('errors')[0] || {};
    if (!post) {
      Post.findOne({ _id: req.params.id }, function (err, post) {
        if (err) return res.json(err);
        res.render('posts/edit', { post: post, errors: errors });
      });
    }
    else {
      post._id = req.params.id;
      res.render('posts/edit', { post: post, errors: errors });
    }
  });

// update
router.put('/:id', function(req, res){
  req.body.updatedAt = Date.now();
  Post.findOneAndUpdate({_id:req.params.id}, req.body, {runValidators:true}, function(err, post){
    if(err) {
      req.flash('post',req.body)
      req.flash('errors',util.parseError(err))
      return res.redirect('/posts'+req.params.id+'/edit')
    }
    res.redirect("/posts/"+req.params.id);
  });
});

// destroy
router.delete('/:id', function(req, res){
  Post.deleteOne({_id:req.params.id}, function(err){
    if(err) return res.json(err);
    res.redirect('/posts');
  });
});

module.exports = router;