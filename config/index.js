'use strict'

const _ = require('lodash')

const environment = process.env.NODE_ENV || 'development'

const all = {
  userRoles: ['patient', 'pharmacist', 'doctor']
}

module.exports = _.merge(all, require('./environment/' + environment + '.js') || {})
