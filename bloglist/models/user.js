const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true },
  adult: {
    type: Boolean,
    default: true
  },
  name: String,
  passwordHash: {
		type: String,
		minlength: 3,

		set: (value) => {
      const hash = bcrypt.hashSync(value, 10)
			return value.length <= 3 ? value : hash
		}
	},
  blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }]
})

userSchema.statics.format = (user) => {
  return {
    id: user.id,
    username: user.username,
    name: user.name,
    blogs: user.blogs
  }
}

const User = mongoose.model('User', userSchema)

module.exports = User