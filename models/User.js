// require mongoose ODM
const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  username: {
    type: String
  },
  email: {
    type: String
  },
  password: {
    type: String
  },
  image: {
    type: String
  },
  type: {
    type: String
  },
  bio: {
    type: String
  },
  private: {
    type: Boolean
  },
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
  likedposts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }]

}, {
  timestamps: true
})

module.exports = mongoose.model('User', UserSchema)