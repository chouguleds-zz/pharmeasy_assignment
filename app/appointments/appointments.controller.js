'use strict'

const Appointment = require('./appointments.model')
const User = require('../users/users.model')

/**
 * Check if appointment is already booked or not
 *
 * @param patient email of patient
 * @param doctor email of doctor
 * @param time appointment time
 */
const _isAppointAlreadyBooked = async function (patient, doctor, time) {

  const query = {
    consulting_doctor: doctor,
    patient: patient,
    from_time: {
      $lte: time
    },
    to_time: {
      $gt: time
    }
  }
  const appointment = await Appointment.find(query)
  if (appointment.length !== 0) {
    return true
  } else {
    return false
  }
}

/**
 * Create appointment by the patient
 *
 * @param req
 * @param res
 */
const create = async function (req, res) {

  let doctor = null
  try {
    doctor = await User.findOne({email: req.body.consulting_doctor})
    // check if doctor is valid or not
    if (doctor === null) {

      return res.status(404).json({
        success: false,
        message: 'Doctor not found.'
      })
    }
    const isAppointAlreadyBooked = await _isAppointAlreadyBooked(req.user.email, req.body.consulting_doctor, req.body.from_time)

    if (isAppointAlreadyBooked === true) {

      return res.status(200).json({
        success: false,
        message: 'Already booked.'
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

/**
 * Get all appointments of the doctor
 *
 * @param req
 * @param res
 */
const getAppointments = async function (req, res) {

  try {
    const appointments = await Appointment.find({
      consulting_doctor: req.user.email
    })
      .populate({
        path: 'patientField',
        select: 'name email -_id'
      })
      .skip(req.body.offset)
      .limit(req.body.limit)
      .sort('created_at')
      .lean()
      .exec()
    return res.status(200).json({
      success: true,
      appointments: appointments
    })

  } catch (err) {
    res.status(500).json('internal server error')
  }

}
module.exports = {
  getAppointments,
  create
}
