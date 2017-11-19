'use strict'

// express initialization
const express = require('express')
const app = express()
const config = require('./config')
const Promise = require('bluebird')
const mongoose = require('mongoose')

mongoose.Promise = Promise

// mongodb connection
mongoose.connect(config.mongo.uri, config.mongo.options)
mongoose.connection.on('error', function (err) {

  console.error('MongoDB connection error: ' + err)
  process.exit(-1)
})

// configure express
require('./config/express')(app)
// register routes on the app
require('./routes')(app)

// start the server
const server = app.listen(config.port, function () {

  console.log('server started on port ' + config.port)
})

module.exports = server
