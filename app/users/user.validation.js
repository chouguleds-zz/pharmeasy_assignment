const Joi = require('joi')

module.exports = {
  create: Joi.object().keys({

    email: Joi.string().email().required(),
    password: Joi.string().min(3).required(),
    name: Joi.string().required(),
    role: Joi.string().required().valid('patient', 'doctor', 'pharmacist'),
    gender: Joi.string().required().valid('male', 'female')
  })
}
