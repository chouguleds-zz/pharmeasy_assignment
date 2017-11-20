'use strict'

// During the test the env variable is set to test
process.env.NODE_ENV = 'test'

const User = require('../../../app/users/users.model')
const testHelper = require('../test.helper')
const PrescViewRequest = require('../../../app/presc_view_requests/presc_view_requests.model')

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
describe('Presc View Requests', function () {

  let getUserFineOneStub
  let getUserFindByIdStub
  let getSavePrescViewRequestStub
  before((done) => {

    getUserFineOneStub = sinon.stub(User, 'findOne', (obj) => {
      return new Promise((resolve) => {

        return resolve(patient1)
      })
    })
    getSavePrescViewRequestStub = sinon.stub(PrescViewRequest.prototype, 'save', () => {
      return new Promise((resolve) => {

        return resolve()
      })
    })
    getUserFindByIdStub = sinon.stub(User, 'findById', (obj) => {
      return new Promise((resolve) => {

        return resolve(doctor)
      })
    })
    done()
  })
  after((done) => {

    getUserFineOneStub.restore()
    getUserFindByIdStub.restore()
    getSavePrescViewRequestStub.restore()
    done()
  })
  /*
     * Test the /CREATE route
     */
  describe('/CREATE presc_view_request', function () {

    it('it should create new presc viewrequest', function (done) {

      const data = {

        'patient': 'chougule.ds@gmail.com',
        'filters': {
          'consulted_doctor': 'akash@gmail.com'
        }
      }
      testHelper.getToken(doctor._id)
        .then(function (token) {

          chai.request(server)
            .post('/api/presc_view_requests/create')
            .set('authorization', token)
            .send(data)
            .then(function (res) {

              res.should.have.status(200)
              res.body.should.be.a('object')
              res.body.should.have.property('success').eql(true)
              res.body.should.have.property('message').eql('Request sent to the user.')
              done()
            })
            .catch(function (err) {
              console.log(err)
            })
        })
    })
  })
})
