'use strict'

const TreatmentRecord = require('./treatment_records.model')

/**
 * Private function to create the date range mongoose query
 *
 * @param startDate
 * @param pendingRequests
 */
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

/**
 * Function to create the view medical record query
 *
 * @param patient email of patient
 * @param filter filters for the search criteria
 */
const generateViewRequestQuery = function (patient, filter) {

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

/**
 * Function to get the patients treatment records
 *
 * @param patient email of patient
 * @param filters filters for the search criteria
 */
const getTreatmentRecords = async function (patient, filters) {

  const query = generateViewRequestQuery(patient, filters)
  try {
    const treatmentRecords = await TreatmentRecord.find(query)
      .select('consulted_doctor diagnosis summery date prescription -_id')
      .populate({
        path: 'consultedDoctorField',
        select: 'name email role -_id'
      })
      .lean()
      .exec()
    return treatmentRecords
  } catch (err) {
    throw new Error('internal server error')
  }
}

module.exports = {
  generateViewRequestQuery,
  getTreatmentRecords
}
