const path = require('path')
console.log(path.join(__dirname, '/../..'))
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
