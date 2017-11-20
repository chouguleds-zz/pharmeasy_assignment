'use strict'

const path = require('path')

module.exports = {

  mongo: {

    uri: 'mongodb://localhost/pharmeasy_assignment',
    useMongoClient: true
  },
  port: 9000,
  secrets: {

    session: 'my-secret'
  },
  root: path.normalize(path.join(__dirname, '/../..'))
}
