const router = require('express').Router()
const db = require('../../models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const authLockedRoute = require('./authLockedRoute')


// GET /users - test endpoint
router.get('/', async (req, res) => {
  const allUsers = await db.User.find({})
  res.json(allUsers)
})

// POST /users/register - CREATE new user
router.post('/register', async (req, res) => {
  try {
    // check if user exists already
    const findUser = await db.User.findOne({
      email: req.body.email
    })

    // don't allow emails to register twice
    if(findUser) return res.status(400).json({ msg: 'email exists already' })
  
    // hash password
    const password = req.body.password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds)
  
    // create new user
    const newUser = new db.User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      image: req.body.image,
      type: req.body.type,
      private: req.body.private,
      bio: req.body.bio      
    })
  
    await newUser.save()

    // create jwt payload
    const payload = {
      username: newUser.username,
      email: newUser.email, 
      id: newUser.id
    }

    // sign jwt and send back
    const token = await jwt.sign(payload, process.env.JWT_SECRET)

    res.json({ token })
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: 'server error'  })
  }
})

// POST /users/login -- validate login credentials
router.post('/login', async (req, res) => {
  try {
    // try to find user in the db
    const foundUser = await db.User.findOne({
      email: req.body.email
    })

    const noLoginMessage = 'Incorrect username or password'

    // if the user is not found in the db, return and sent a status of 400 with a message
    if(!foundUser) return res.status(400).json({ msg: noLoginMessage})
    
    // check the password from the req body against the password in the database
    const matchPasswords = await bcrypt.compare(req.body.password, foundUser.password)
    
    // if provided password does not match, return an send a status of 400 with a message
    if(!matchPasswords) return res.status(400).json({ msg: noLoginMessage})

    // create jwt payload
    const payload = {
      username: foundUser.username,
      email: foundUser.email, 
      id: foundUser.id
    }

    // sign jwt and send back
    const token = await jwt.sign(payload, process.env.JWT_SECRET)
    
    res.json({ token })
  } catch(error) {
    console.log(error)
    res.status(500).json({ msg: 'server error'  })
  }
})


// GET /auth-locked - will redirect if bad jwt token is found
router.get('/:username', async (req, res) => {
  // you will have access to the user on the res.local.user
  try {
    const profile = await db.User.findOne({
      username: req.params.username
    }).populate('posts')

    res.json(profile)
  } catch(err) {
    console.log(err)
    res.status(500).json({ msg: 'server error'  })
  }
})

// POST /auth-locked - will redirect if bad jwt token is found
router.post('/:username', authLockedRoute, async (req, res) => {
  // you will have access to the user on the res.local.user
  try {
    const newFriend = await db.User.findOne({
      username: req.params.username
    })
       
    res.locals.user.friends.push(newFriend)
    
    await res.locals.user.save()
    
    const user = res.locals.user.populate('friends')

    res.json(user)

  } catch(err) {
    console.log(err)
    res.status(500).json({ msg: 'server error'  })
  }
})

router.put('/:username/edit', async (req, res) => {
  try {
    const options = {new: true} 
    const updatedUser = await db.User.findOneAndUpdate({ username: req.params.username}, req.body, options)
    res.json(updatedUser)
  }catch(err) {
    console.warn(err)
    res.status(500).json({ msg: 'server error'  })
  }
})

router.delete('/:username',  async (req, res) => {
  try {
    await db.User.findOneAndDelete({ username: req.params.username })
    res.sendStatus(204)
  }catch(err) {
    console.warn(err)
    res.status(500).json({ msg: 'server error'  })
  }
})



module.exports = router