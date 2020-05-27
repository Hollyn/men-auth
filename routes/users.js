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
    role: req.body.role
  })

  User.addUser(newUser, (err, user) => {
    if (err) res.json({error: 404, success: false, msg: "User cannot be registered"})
    res.json({error: 200, success: true, user: user})
  })
})

// login
router.post('/login', (req, res, next) => {
  let email = req.body.email
  let password = req.body.password

  User.findByEmail(email, (err, user) => {
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
          email: user.email,
          role: user.role
        }
      })
    })
  })
})

// profile
router.get('/profile', passport.authenticate("jwt", {session: false}), (req, res, next) => {
  res.json({user: req.user})
})

// add user
router.get('/list', passport.authenticate("jwt", {session: false}), (req, res, next) => {
  let currentUser = req.user[0]

  if (currentUser.role == 'user'){
    res.json({error: 401, msg: "You are not allow to get here"})
  }

  User.findAll((err, users) => {
    if (err) res.json({erro: 404, msg: "Error " + err})
    res.json({
      error: 200,
      users: users
    })
  })
})

// add user
router.post('/add', passport.authenticate("jwt", {session: false}), (req, res, next) => {
    let currentUser = req.user[0]

  if (currentUser.role == 'user'){
    res.json({error: 401, msg: "You are not allow to get here"})
  }

  let newUser = new User({
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role
  })

  User.addUser(newUser, (err, user) => {
    if (err) res.json({error: 404, success: false, msg: "User cannot be registered"})
    res.json({error: 200, success: true, user: user})
  })
  


})

// edit user
router.post('/edit', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  let currentUser = req.user[0]

  if (currentUser.role == 'user'){
    res.json({error: 401, msg: "You are not allow to get here"})
  }


  let email = req.body.email
  let update = req.body.user

  User.update(email, update, (err, user) => {
    if (err) res.json({error: 404, msg: "Error " + err})

    res.json({error: 200, user: user})
  })

})

// delete user
router.post('/delete', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  let currentUser = req.user[0]

  if (currentUser.role == 'user'){
    res.json({error: 401, msg: "You are not authorized here"})
  }

  const email = req.body.email
  User.delete(email, (err, details) => {
    if (err) res.json({error: 404, msg: "Error : " + err})

    res.json({
      error: 200,
      details: details
    })
  })

})

module.exports = router;
