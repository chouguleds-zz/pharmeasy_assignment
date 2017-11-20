'use strict'

// During the test the env variable is set to test
process.env.NODE_ENV = 'test'

const User = require('../../../app/users/users.model')
const Appointment = require('../../../app/appointments/appointments.model')
const TreatmentRecord = require('../../../app/treatment_records/treatment_records.model')
const testHelper = require('../test.helper')
const PrescViewRequest = require('../../../app/presc_view_requests/presc_view_requests.model')
const treatmentRecordDal = require('../../../app/treatment_records/treatment_record.dal')

// Require the dev-dependencies
const chai = require('chai')
const sinon = require('sinon')
const chaiHttp = require('chai-http')
const server = require('../../../app')
chai.should()

const treatmentRecords = [{
  'appointment_id': '5a1147eb685a1482e6aa3cca',
  'patient': 'chougule.ds@gmail.com',
  'consulted_doctor': 'akash@gmail.com',
  'diagnosis': 'fever',
  'summery': 'patient has high fever',
  'date': 1511081013000,
  'prescription': [{
    'medication': 'crosine',
    'from_date': 1511081013000,
    'to_date': 1511953771000,
    'instructions': 'daily one tablet'
  }]
}]

const prescViewRequest = {
  '_id': '5a11ac5803bee33e53ef5d43',
  'updated_at': '2017-11-19T16:07:52.488Z',
  'created_at': '2017-11-19T16:07:52.488Z',
  'patient': 'chougule.ds@gmail.com',
  'request_by': 'akash@gmail.com',
  'filters': {
    'appointment_date': {
      'type': 'exact',
      'exact': '2017-11-19T13:19:46.974Z'
    }
  },
  'is_approved': true
}

const viewRequest = {
  'request_id': '5a11ac5803bee33e53ef5d43',
  'limit': 10,
  'offset': 0
}
const doctor = {
  '_id': '5a112402f028fd2fc9cc4deb',
  'updated_at': '2017-11-19T06:26:10.985Z',
  'created_at': '2017-11-19T06:26:10.985Z',
  'name': 'akash',
  'email': 'akash@gmail.com',
  'role': 'doctor',
  'gender': 'male'
}

chai.use(chaiHttp)
// Our parent block
describe('Appointments', function () {

  let getSaveTreatmentRecordStub
  let getUserFindByIdStub
  let getAppointStub
  let getPrescViewRequestStub
  let getTreatmentRecordsStub
  before((done) => {

    getSaveTreatmentRecordStub = sinon.stub(TreatmentRecord.prototype, 'save', () => {
      return new Promise((resolve) => {

        return resolve()
      })
    })
    getUserFindByIdStub = sinon.stub(User, 'findById', (obj) => {
      return new Promise((resolve) => {

        return resolve(doctor)
      })
    })
    getAppointStub = sinon.stub(Appointment, 'findOne', () => {
      return new Promise((resolve) => {

        return resolve({})
      })
    })
    getPrescViewRequestStub = sinon.stub(PrescViewRequest, 'findOne', () => {
      return new Promise((resolve) => {

        return resolve(prescViewRequest)
      })
    })
    getTreatmentRecordsStub = sinon.stub(treatmentRecordDal, 'getTreatmentRecords', () => {
      return new Promise((resolve) => {

        return resolve(treatmentRecords)
      })
    })

    done()
  })
  after((done) => {
    getSaveTreatmentRecordStub.restore()
    getUserFindByIdStub.restore()
    getAppointStub.restore()
    getTreatmentRecordsStub.restore()
    getPrescViewRequestStub.restore()
    done()
  })
  /*
     * Test the /CREATE route
     */
  describe('/CREATE treatment record', function () {

    it('it should create new treatment record to db', function (done) {

      testHelper.getToken(doctor._id)
        .then(function (token) {

          chai.request(server)
            .post('/api/treatment_records/create')
            .set('authorization', token)
            .send(treatmentRecords[0])
            .then(function (res) {

              res.should.have.status(200)
              res.body.should.be.a('object')
              res.body.should.have.property('success').eql(true)
              res.body.should.have.property('message').eql('Treatment record added.')
              done()
            })
            .catch(function (err) {
              console.log(err)
            })
        })
    })
  })
  describe('/VIEW RECORD treatment record', function () {

    it('it should list treatment record if approved', function (done) {

      testHelper.getToken(doctor._id)
        .then(function (token) {

          chai.request(server)
            .post('/api/treatment_records/viewRecord')
            .set('authorization', token)
            .send(viewRequest)
            .then(function (res) {

              res.should.have.status(200)
              res.body.should.have.property('success').eql(true)
              res.body.treatmentRecords.length.should.eql(1)
              done()
            })
            .catch(function (err) {
              console.log(err)
            })
        })
    })
  })
})
