'use strict'

const joi = require('joi')

const prescriptionObject = {
  medication: joi.string().required(),
  from_date: joi.date().timestamp().required(),
  to_date: joi.date().timestamp().required(),
  instructions: joi.string().required()
}

const prescriptions = joi.array().optional().items(prescriptionObject).description('prescriptions for the patient')

module.exports = {
  create: joi.object().keys({
    appointment_id: joi.string().required(),
    diagnosis: joi.string().required(),
    patient: joi.string().email().required(),
    consulted_doctor: joi.string().email().required(),
    summery: joi.string(),
    date: joi.date().timestamp().optional().default(new Date().getTime()),
    prescription: prescriptions
  })
}
