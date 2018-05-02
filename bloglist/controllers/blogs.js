const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 } )

  response.json(blogs.map(Blog.format))
})

blogsRouter.post('/', async (request, response) => {
  const token = request.token
  const decodedToken = jwt.verify(token, process.env.SECRET)

  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  if (request.body.title === undefined) {
    return response.status(400).json({ error: 'title missing' })
  }

  if (request.body.url === undefined) {
    return response.status(400).json({ error: 'url missing' })
  }

  const user = await User.findById(decodedToken.id)
  const {title, author, url, userId } = request.body
  const likes = request.body.likes ? request.body.likes : 0

  const blog = new Blog({
      title,
      author,
      url,
      likes,
      user: user._id
    }
  )

  const newBlog = await blog.save()
  user.blogs = user.blogs.concat(newBlog._id)
	await user.save()

  response
    .status(201)
    .json(newBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  try {
    await Blog.findByIdAndRemove(request.params.id)

    response.status(204).end()
  } catch (exception) {
    console.log(exception)
    response.status(400).send({ error: 'malformatted id' })
  }
})

module.exports = blogsRouter