'use strict'

const users = require('./app/users')
const auth = require('./auth')
const appointments = require('./app/appointments')
const treatmentRecords = require('./app/treatment_records')
const prescViewRequests = require('./app/presc_view_requests')

module.exports = function (app) {

  // patent level routes
  app.use('/api/presc_view_requests', prescViewRequests)
  app.use('/api/treatment_records', treatmentRecords)
  app.use('/api/users', users)
  app.use('/api/appointments', appointments)
  app.use('/auth', auth)
}
