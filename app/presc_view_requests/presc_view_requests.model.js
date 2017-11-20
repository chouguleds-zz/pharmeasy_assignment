'use strict'

const mongoose = require('mongoose')

const PrescViewRequestSchema = new mongoose.Schema({

  is_approved: {
    type: Boolean,
    default: false
  },
  patient: String,
  request_by: String,
  filters: {
    appointment_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment'
    },
    appointment_date: {
      type: {
        type: String,
        enum: ['exact', 'range']
      },
      exact: Date,
      range: {
        from: Date,
        to: Date
      }
    },
    consulted_doctor: String
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
}, {
  toObject: {
    virtuals: true
  }
})

PrescViewRequestSchema.virtual('requestBy', {
  ref: 'User',
  localField: 'request_by',
  foreignField: 'email',
  justOne: true
})

module.exports = mongoose.model('PrescViewRequest', PrescViewRequestSchema)
