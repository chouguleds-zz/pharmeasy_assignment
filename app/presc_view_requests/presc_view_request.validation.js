'use strict'

const joi = require('joi')

module.exports = {
  create: joi.object().keys({
    patient: joi.string().required(),
    filters: joi.object().keys({
      appointment_id: joi.string(),
      appointment_date: joi.object().keys({
        type: joi.string().valid('exact', 'range'),
        exact: joi.date().timestamp().when('type', { is: 'exact', then: joi.date().timestamp().required()}),
        range: joi.object().keys({}).when('type', { is: 'range',
          then: joi.object().keys({
            from: joi.date().timestamp().required(),
            to: joi.date().timestamp().required()
          }).required()
        })
      }),
      consulted_doctor: joi.string()
    })
  })
}
