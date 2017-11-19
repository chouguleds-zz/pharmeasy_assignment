'use strict'
const PrescViewRequest = require('./presc_view_requests.model')
const User = require('../users/users.model')
const TreatmentRecord = require('../treatment_records/treatment_records.model')

const _generateDateQuery = function (startDate, endDate) {

  const fromDate = {
    day: startDate.getDate(),
    month: startDate.getMonth(),
    year: startDate.getFullYear()
  }

  const toDate = {
    day: endDate.getDate(),
    month: endDate.getMonth(),
    year: endDate.getFullYear()
  }
  return {
    $gte: new Date(fromDate.year, fromDate.month, fromDate.day),
    $lt: new Date(toDate.year, toDate.month, toDate.day)
  }
}

const _generateViewRequestQuery = function (patient, filter) {

  const query = {}
  query.patient = patient

  if (filter.appointment_id) {
    query.appointment_id = filter.appointment_id
  }
  if (filter.by_doctor) {
    query.by_doctor = filter.by_doctor
  }
  if (filter.appointmentDate) {

    let fromDate = null
    let toDate = null

    if (filter.appointmentDate.type === 'exact') {

      fromDate = new Date(filter.appointmentDate.exact)
      toDate = fromDate.setDate(fromDate.getDate() + 1)
    } else if (filter.appointmentDate.type === 'range') {

      fromDate = new Date(filter.appointmentDate.range.from)
      toDate = new Date(filter.appointmentDate.range.to)
    }
    query.date = _generateDateQuery(fromDate, toDate)
  }
  return query
}

const getPendingRequestsFromDb = async function (patient, pendingRequests) {

  const requests = []

  for (let i = 0; i < pendingRequests.length; i++) {

    const query = _generateViewRequestQuery(patient, pendingRequests[i].filters)
    const request = {}
    const treatmentRecords = await TreatmentRecord.find(query)
      .select('consulted_doctor diagnosis summery date prescription -_id')
      .populate({
        path: 'consultedDoctorField',
        select: 'name email role -_id'
      })
      .lean()
      .exec()
    request.treatmentRecords = treatmentRecords
    request.pendingRequestId = pendingRequests[i]._id
    request.requestBy = pendingRequests[i].requestBy
    requests.push(request)
  }
  return requests
}

const getPendingRequests = async function (req, res) {

  try {

    const pendingRequest = await PrescViewRequest.find()
      .select('request_by filters')
      .where({
        patient: req.user.email,
        is_approved: false
      })
      .populate({
        path: 'requestBy',
        select: 'name email -_id'
      })
      .skip(req.body.offset)
      .limit(req.body.limit)
      .sort('created_at')
      .lean()
      .exec()

    const requests = await getPendingRequestsFromDb(req.user.email, pendingRequest)
    return res.status(200).json({
      success: true,
      pendingRequests: requests
    })
  } catch (err) {

    console.log(err)
    res.status(500).json('internal server error')
  }

}
const create = async function (req, res) {

  let patient = null
  try {

    patient = await User.findOne({email: req.body.patient})
    if (patient === null) {

      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      })
    }

    const prescViewRequest = new PrescViewRequest({

      patient: req.body.patient,
      request_by: req.user.email,
      filters: req.body.filters
    })
    await prescViewRequest.save()

    return res.status(200).json({
      success: true,
      message: 'Request sent to the user.'
    })

  } catch (err) {

    console.log(err)
    res.status(500).json('internal server error')
  }
}
const approve = async function (req, res) {

  try {
    const prescViewRequest = await PrescViewRequest.findOne({
      _id: req.body.viewRequestId,
      patient: req.user.email
    })

    if (prescViewRequest === null) {

      return res.status(404).json({
        success: false,
        message: 'Request not found'
      })
    }
    if (prescViewRequest.is_approved === true) {

      return res.status(200).json({
        success: true,
        message: 'Request already approved.'
      })
    }
    prescViewRequest.is_approved = true
    await prescViewRequest.save()

    return res.status(200).json({
      success: true,
      message: 'Request approved.'
    })
  } catch (err) {
    res.status(500).json('internal server error')
  }
}

const getSentRequests = async function (req, res) {

  try {

    const getSentRequests = await PrescViewRequest.find()
      .select('is_approved patient request_by filters')
      .where({
        request_by: req.user.email
      })
      .sort('created_at')
      .skip(req.body.offset)
      .limit(req.body.limit)

    return res.status(200).json({
      success: true,
      sentRequests: getSentRequests
    })

  } catch (err) {

    res.status(500).json('internal server error')
  }
}

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
    const query = _generateViewRequestQuery(viewRequest.patient, viewRequest.filters)
    const treatmentRecords = await TreatmentRecord.find(query)
      .select('consulted_doctor diagnosis summery date prescription -_id')
      .populate({
        path: 'consultedDoctorField',
        select: 'name email role -_id'
      })
      .sort('date')
      .skip(req.body.offset)
      .limit(req.body.limit)
      .lean()
      .exec()

    return res.status(200).json({
      success: true,
      treatmentRecords: treatmentRecords
    })
  } catch (err) {
    res.status(500).json('internal server error')
  }
}

module.exports = {
  getPendingRequests,
  create,
  approve,
  getSentRequests,
  viewRecord
}
