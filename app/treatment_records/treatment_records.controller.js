'use strict'

const TreatmentRecord = require('./treatment_records.model')
const Appointment = require('../appointments/appointments.model')
const PrescViewRequest = require('../presc_view_requests/presc_view_requests.model')
const treatmentRecordDal = require('./treatment_record.dal')

/**
 * Function to create the treatment record
 *
 * @param req
 * @param res
 */
const create = async function (req, res) {

  let appointment = null
  try {

    appointment = await Appointment.findOne({_id: req.body.appointment_id})

    if (appointment === null) {

      return res.status(404).json({
        success: false,
        message: 'appointment not found'
      })
    }

    const treatmentRecord = new TreatmentRecord({
      appointment_id: req.body.appointment_id,
      diagnosis: req.body.diagnosis,
      patient: req.body.patient,
      consulted_doctor: req.user.email,
      summery: req.body.summery,
      date: req.body.date,
      prescription: req.body.prescription
    })
    await treatmentRecord.save()

    return res.status(200).json({
      success: true,
      message: 'Treatment record added.'
    })

  } catch (err) {

    console.log(err)
    res.status(500).json('internal server error')
  }
}

/**
 * Function to view the treatment record
 *
 * @param req
 * @param res
 */
const viewRecord = async function (req, res) {

  try {
    const viewRequest = await PrescViewRequest.findOne({
      _id: req.body.request_id
    })
    if (!viewRequest || (viewRequest.request_by !== req.user.email)) {

      return res.status(404).json({
        success: true,
        message: 'invalid request id.'
      })
    }
    if (viewRequest.is_approved === false) {

      return res.status(200).json({
        success: true,
        message: 'Pending approval.'
      })
    }
    const treatmentRecords = await treatmentRecordDal.getTreatmentRecords(viewRequest.patient, viewRequest.filters)

    return res.status(200).json({
      success: true,
      treatmentRecords: treatmentRecords
    })
  } catch (err) {
    res.status(500).json('internal server error')
  }
}

module.exports = {
  viewRecord,
  create
}