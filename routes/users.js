var express = require('express');
var router = express.Router();
let User = require('../models/user')
let jwt = require('jsonwebtoken')
const config = require('../config/database')
const passport = require('passport')

// register
router.post('/register', (req, res, next) => {
  let newUser = new User({
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  })

  User.addUser(newUser, (err, user) => {
    if (err) res.json({error: 404, success: false, msg: "User cannot be registered"})
    res.json({error: 200, success: true, user: user})
  })
})

// login
router.post('/login', (req, res, next) => {
  let username = req.body.username
  let password = req.body.password

  User.findByUsername(username, (err, user) => {
    if (err) res.json({error: 404, success: false, msg: "User cannot be find"})

    User.comparePassword(password, user.password, (err, is_match) => {
      if (err) res.json({error: 404, success: false, msg: "Cannot be authenticate"})

      if (!is_match) { 
        res.json({
          error: 404,
          success: false, 
          msg: "Your password does not match this username"
        })
      }

      const token = jwt.sign({data: user}, config.secret, {
        expiresIn: '1h' // 1 hour
      })

      res.json({
        error: 200,
        success: true,
        token: "JWT " + token,
        user: {
          name: user.name,
          username: user.username,
          email: user.email
        }
      })
    })
  })
})

// profile
router.get('/profile', passport.authenticate("jwt", {session: false}), (req, res, next) => {
  res.json({user: req.user})
})

module.exports = router;
