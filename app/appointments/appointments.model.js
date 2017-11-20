'use strict'

const mongoose = require('mongoose')

const AppointmentSchema = new mongoose.Schema({

  patient: {
    type: String
  },
  consulting_doctor: {
    type: String
  },
  from_time: Date,
  to_time: Date,
  status: {
    type: String,
    enum: ['booked', 'completed', 'cancelled'],
    default: 'booked'
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

module.exports = mongoose.model('Appointment', AppointmentSchema)