'use strict'

// During the test the env variable is set to test
process.env.NODE_ENV = 'test'

const User = require('../../../app/users/users.model')
const Appointment = require('../../../app/appointments/appointments.model')
const authService = require('../../../auth/auth.service')
const testHelper = require('../test.helper')

// Require the dev-dependencies
const chai = require('chai')
const sinon = require('sinon')
const chaiHttp = require('chai-http')
const server = require('../../../app')
chai.should()

const patient1 = {
  '_id': '5a112402f028fd2fc9cc4dea',
  'updated_at': '2017-11-19T06:26:10.985Z',
  'created_at': '2017-11-19T06:26:10.985Z',
  'name': 'deepak',
  'email': 'chougule.ds@gmail.com',
  'role': 'patient',
  'gender': 'male'
}
const patient2 = {
  '_id': '5a112402f028fd2fc9cc4deb',
  'updated_at': '2017-11-19T06:26:10.985Z',
  'created_at': '2017-11-19T06:26:10.985Z',
  'name': 'deepak',
  'email': 'deepak@gmail.com',
  'role': 'patient',
  'gender': 'male'
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

  let getSaveAppointmentStub
  let getUserFineOneStub
  let getHasRoleStub
  let getUserFindByIdStub
  let getAppointStub
  before((done) => {

    getUserFineOneStub = sinon.stub(User, 'findOne', (obj) => {
      return new Promise((resolve) => {

        if (obj.email === doctor.email) {
          return resolve({
            _doc: {
              doctor
            }
          })
        } else {
          return resolve(null)
        }
      })
    })
    getSaveAppointmentStub = sinon.stub(Appointment.prototype, 'save', () => {
      return new Promise((resolve) => {

        return resolve()
      })
    })

    getHasRoleStub = sinon.stub(authService, 'hasRole', () => {
      return new Promise((resolve) => {

        return resolve()
      })
    })
    getUserFindByIdStub = sinon.stub(User, 'findById', (obj) => {
      return new Promise((resolve) => {

        if (obj === patient1._id) {
          return resolve(patient1)
        } else {
          return resolve(patient2)
        }

      })
    })
    getAppointStub = sinon.stub(Appointment, 'find', (query) => {
      return new Promise((resolve) => {
        if (query.patient === patient1.email) {
          return resolve([1])
        } else {
          return resolve([])
        }
      })
    })
    done()
  })
  after((done) => {
    getSaveAppointmentStub.restore()
    getUserFineOneStub.restore()
    getHasRoleStub.restore()
    getUserFindByIdStub.restore()
    getAppointStub.restore()
    done()
  })
  /*
     * Test the /CREATE route
     */
  describe('/CREATE appointment', function () {

    it('it should create new appointment to db', function (done) {

      const data = {
        'patient': 'deepak@gmail.com',
        'consulting_doctor': 'akash@gmail.com',
        'from_time': 1511081013000,
        'to_time': 1511084613000
      }
      testHelper.getToken(patient2._id)
        .then(function (token) {

          chai.request(server)
            .post('/api/appointments/create')
            .set('authorization', token)
            .send(data)
            .then(function (res) {

              res.should.have.status(200)
              res.body.should.be.a('object')
              res.body.should.have.property('success').eql(true)
              res.body.should.have.property('message').eql('Appointment booked.')
              done()
            })
            .catch(function (err) {
              console.log(err)
            })
        })
    })

    it('it should show error message if appointment is already booked.', function (done) {

      const data = {
        'patient': 'chougule.ds@gmail.com',
        'consulting_doctor': 'akash@gmail.com',
        'from_time': 1511081013000,
        'to_time': 1511084613000
      }
      testHelper.getToken(patient1._id)
        .then(function (token) {

          chai.request(server)
            .post('/api/appointments/create')
            .set('authorization', token)
            .send(data)
            .then(function (res) {
              res.should.have.status(200)
              res.body.should.be.a('object')
              res.body.should.have.property('success').eql(false)
              res.body.should.have.property('message').eql('Already booked.')
              done()
            })
        })
        .catch(function (err) {
          console.log(err)
        })
    })
  })
})
