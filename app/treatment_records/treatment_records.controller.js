const TreatmentRecord = require('./treatment_records.model')
const Appointment = require('../appointments/appointments.model')

exports.create = async function (req, res) {

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
