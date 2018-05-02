const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
	const users = await User
		.find({})
		.populate('blogs', { _id: 1, title: 1, author: 1, url: 1, likes: 1 })

  console.log(users)

  response.json(users.map(User.format))
 })

usersRouter.post('/', async (request, response) => {
  try {
    const {username, name, password} = request.body
    const existingUser = await User.find({username})
    if (existingUser.length>0) {
      return response.status(400).json({ error: 'username must be unique' })
    }

    const user = new User({
      username,
      name,
      passwordHash: password
    })

    const savedUser = await user.save()

    response.json(User.format(savedUser))
  } catch (exception) {
    console.log(exception)
    response.status(500).json({ error: 'something went wrong...' })
  }
})

module.exports = usersRouter