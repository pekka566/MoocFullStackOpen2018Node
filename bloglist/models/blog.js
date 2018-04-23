const mongoose = require('mongoose')
require('dotenv').config()
const url = process.env.MONGODB_URI
mongoose.connect(url)

const Blog = mongoose.model('Blog', {
  title: String,
  author: String,
  url: String,
  likes: Number
})

module.exports = Blog