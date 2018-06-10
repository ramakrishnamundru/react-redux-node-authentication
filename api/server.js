const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const config = require('./config/config.js')
const allowCrossDomain = require('./headers/cross-domain')
const userRoutes = require('./controller/user')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(allowCrossDomain)

let mongoose = require('mongoose')
mongoose.connect(config.database)

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log('listening on ' + port)
})

app.use('/api', userRoutes)
