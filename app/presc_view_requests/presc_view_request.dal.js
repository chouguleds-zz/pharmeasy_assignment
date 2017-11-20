'use strict'

const PrescViewRequest = require('./presc_view_requests.model')

/**
 * Get patients pending requests for the approval
 *
 * @param patient patients email
 * @param limit
 * @param offset
 */
const getPendingRequests = async function (patient, limit, offset) {

  try {

    const pendingRequests = await PrescViewRequest.find()
      .select('request_by filters')
      .where({
        patient: patient,
        is_approved: false
      })
      .populate({
        path: 'requestBy',
        select: 'name email -_id'
      })
      .skip(offset)
      .limit(limit)
      .sort('created_at')
      .lean()
      .exec()
    return pendingRequests

  } catch (err) {
    throw new Error('internal server error')
  }
}

/**
 * Get the request sent by the doctor and the pharmacist to view the medical record
 *
 * @param requestBy email of the requesting person
 * @param limit
 * @param offset
 */
const getSentRequests = async function (requestBy, limit, offset) {

  try {

    const getSentRequests = await PrescViewRequest.find()
      .select('is_approved patient request_by filters')
      .where({
        request_by: requestBy
      })
      .sort('created_at')
      .skip(offset)
      .limit(limit)

    return getSentRequests
  } catch (err) {

    throw new Error('internal server error')
  }
}

module.exports = {
  getPendingRequests,
  getSentRequests
}
