'use strict'

const PrescViewRequest = require('./presc_view_requests.model')
const User = require('../users/users.model')
const treatmentRecordDal = require('../treatment_records/treatment_record.dal')
const prescViewRequestDal = require('./presc_view_request.dal')

/**
 * Private function to get the treatment records from the database
 *
 * @param patient email of the patient
 * @param pendingRequests pending view medical record requests of the patient
 */
const _getTreatmentRecordsFromDb = async function (patient, pendingRequests) {

  const requests = []

  for (let i = 0; i < pendingRequests.length; i++) {

    const request = {}
    const treatmentRecords = await treatmentRecordDal.getTreatmentRecords(patient, pendingRequests[i].filters)
    request.treatmentRecords = treatmentRecords
    request.pendingRequestId = pendingRequests[i]._id
    request.requestBy = pendingRequests[i].requestBy
    requests.push(request)
  }
  return requests
}


/**
 * Function to get the pending view requests of the patient
 *
 * @param req
 * @param res
 */
const getPendingRequests = async function (req, res) {

  try {

    const pendingRequests = await prescViewRequestDal.getPendingRequests(req.user.email, req.body.limit, req.body.offset)
    const requests = await _getTreatmentRecordsFromDb(req.user.email, pendingRequests)
    return res.status(200).json({
      success: true,
      pendingRequests: requests
    })
  } catch (err) {

    console.log(err)
    res.status(500).json('internal server error')
  }

}

/**
 * Function to create a view medical record request
 *
 * @param req
 * @param res
 */
const create = async function (req, res) {

  let patient = null
  try {

    patient = await User.findOne({email: req.body.patient})
    // check if patient is valid or not
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

/**
 * Function to approve the pending request by the patient
 *
 * @param req
 * @param res
 */
const approve = async function (req, res) {

  try {
    const prescViewRequest = await PrescViewRequest.findOne({
      _id: req.body.viewRequestId,
      patient: req.user.email
    })
    // check if the request is valid or not
    if (prescViewRequest === null) {

      return res.status(404).json({
        success: false,
        message: 'Request not found'
      })
    }
    // return if request is already approved
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

/**
 * Function to get the view request sent by the doctor or pharmacist
 *
 * @param req
 * @param res
 */
const getSentRequests = async function (req, res) {

  try {

    const getSentRequests = await prescViewRequestDal.getSentRequests(req.user.email, req.body.limit, req.body.offset)
    return res.status(200).json({
      success: true,
      sentRequests: getSentRequests
    })

  } catch (err) {

    res.status(500).json('internal server error')
  }
}

module.exports = {
  getPendingRequests,
  create,
  approve,
  getSentRequests
}
