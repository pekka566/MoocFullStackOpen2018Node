const mongoose = require('mongoose');
require('dotenv').config();
const url = process.env.MONGODB_URI;
mongoose.connect(url);

const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
  comments: [String],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

blogSchema.statics.format = blog => {
  return {
    id: blog._id,
    title: blog.title,
    author: blog.author,
    url: blog.url,
    likes: blog.likes,
    user: blog.user,
    comments: blog.comments
  };
};

const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;
