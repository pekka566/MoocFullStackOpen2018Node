const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const tokenExtractor = require('./middlewares/tokenextractor')
const blogRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

app.use(cors())
app.use(bodyParser.json())
app.use(tokenExtractor)

app.use('/api/users', usersRouter)
app.use('/api/blogs', blogRouter)
app.use('/api/login', loginRouter)

const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = {
  app
}