//models/Post.js
const mongoose = require('mongoose');
const postSchema = mongoose.Schema({
  title:{type:String, required:[true,'Title is required']},
  body:{type:String, required:[true,'Body is required']},
  author:{type:mongoose.Schema.Types.ObjectId, ref:'user', required:true},
  createdAt:{type:Date, dgefault:Date.now},
  updatedAt:{type:Date},
});

const Post = mongoose.model('post', postSchema);
module.exports = Post;