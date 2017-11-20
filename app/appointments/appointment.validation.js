'use strict'

const joi = require('joi')

module.exports = {
  create: joi.object().keys({

    patient: joi.string().email().required(),
    consulting_doctor: joi.string().email().required(),
    from_time: joi.date().timestamp().required(),
    to_time: joi.date().timestamp().required()
  })
}
