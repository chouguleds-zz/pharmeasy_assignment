'use strict'

const mongoose = require('mongoose')

const TreatmentRecordSchema = new mongoose.Schema({

  appointment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  patient: String,
  consulted_doctor: String,
  diagnosis: String,
  summery: String,
  date: {
    type: Date,
    default: Date.now
  },
  prescription: [{

    medication: String,
    from_date: Date,
    to_date: Date,
    instructions: String
  }]
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

TreatmentRecordSchema.virtual('patientField', {
  ref: 'User',
  localField: 'patient',
  foreignField: 'email',
  justOne: true
})

TreatmentRecordSchema.virtual('consultedDoctorField', {
  ref: 'User',
  localField: 'consulted_doctor',
  foreignField: 'email',
  justOne: true
})

module.exports = mongoose.model('TreatmentRecord', TreatmentRecordSchema)
