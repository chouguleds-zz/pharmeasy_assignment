'use strict'

const path = require('path')

module.exports = {

  mongo: {

    uri: 'mongodb://localhost/my_feeds-test',
    useMongoClient: true
  },
  port: 9000,
  secrets: {

    session: 'my-test-secret'
  },
  root: path.normalize(path.join(__dirname, '/../..'))
}
