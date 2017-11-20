'use strict'

const Appointment = require('./appointments.model')
const User = require('../users/users.model')

/**
 * Create appointment by the patient
 *
 * @param req
 * @param res
 */
exports.create = async function (req, res) {

  let doctor = null
  try {
    doctor = await User.findOne({email: req.body.consulting_doctor})

    if (doctor === null) {

      return res.status(404).json({
        success: false,
        message: 'Doctor not found.'
      })
    }

    const appointment = new Appointment({
      patient: req.user.email,
      consulting_doctor: req.body.consulting_doctor,
      from_time: req.body.from_time,
      to_time: req.body.to_time
    })

    await appointment.save()

    return res.status(200).json({
      success: true,
      message: 'Appointment booked.'
    })

  } catch (err) {

    res.status(500).json('internal server error')
  }
}
