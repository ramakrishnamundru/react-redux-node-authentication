const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const _ = require('lodash')
const bson = require('bson-ext')

const User = require('../models/user')
const config = require('../config/config')

const userRoutes = express.Router()

var throwFailed = function (res, message) {
  return res.json({ success: false, message: message })
}

var generateToken = function ({ id, username }) {
  return jwt.sign({ id, name: username }, config.secret, { expiresIn: config.jwtExpiry })
}

userRoutes.post('/authenticate', function (req, res) {
  const username = req.body.name
  const password = req.body.password

  if (_.isUndefined(username) || _.isUndefined(password)) {
    return throwFailed(res, 'Authentication failed. User not found.')
  }

  User
    .findOne({ name: username })
    .exec()
    .then(function (user) {
      if (!user) {
        return throwFailed(res, 'Authentication failed. User not found.')
      }

      bcrypt.compare(password, user.password, function (errBcrypt, resBcrypt) {
        if (errBcrypt || resBcrypt == false) {
          return throwFailed(res, 'Authentication failed. Wrong password.')
        }

        return res.json({
          token: generateToken({
            id: user._id,
            username
          }),
          userId: user._id
        })
      })
    })
})

userRoutes.post('/register', function (req, res) {
  const username = req.body.name
  const password = req.body.password
  const surname = req.body.surname
  const email = req.body.email

  if (_.isUndefined(username) || _.isUndefined(password)) {
    return throwFailed(res, 'Cannot register. Provide username or password.')
  }

  User
    .findOne({ name: username })
    .exec()
    .then(function (user) {
      if (user) {
        return throwFailed(res, 'There is already user with such username.')
      }

      bcrypt.hash(password, config.saltRounds, function (err, hash) {
        var user = new User({
          name: username,
          surname: surname,
          email: email,
          password: hash,
          admin: false
        })

        user.save(function (err) {
          if (err) throw err
          return res.json({ success: true, message: 'User registered successfully.' })
        })
      })
    })
})

const tokenVerifier = require('../auth/token-verifier')
userRoutes.use(tokenVerifier)

userRoutes.get('/users/:id', function (req, res) {
  var userId = req.params.id

  if (!bson.ObjectId.isValid(userId)) {
    return res.json({ error: 'There is no id defined' })
  }

  User
    .findOne({ _id: userId })
    .exec()
    .then(function (user) {
      res.json({
        name: user.name,
        email: user.email,
        surname: user.surname
      })
    })
})

userRoutes.post('/users/:id', function (req, res) {
  const userInfo = {
    name: req.body.name,
    surname: req.body.surname,
    email: req.body.email
  }

  User.update({ _id: req.params.id }, { $set: userInfo }, function (err, user) {
    if (err) throw err

    res.json(user)
  })
})

userRoutes.get('/users', function (req, res) {
  User.find({}, function (err, users) {
    res.json(users)
  })
})

module.exports = userRoutes
