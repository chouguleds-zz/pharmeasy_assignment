'use strict'

const express = require('express')
const router = express.Router()
const controller = require('./presc_view_requests.controller')
const validator = require('../../lib/validator')
const prescViewRequestValidationSchema = require('./presc_view_request.validation')
const auth = require('../../auth/auth.service.js')

router.post('/create', validator(prescViewRequestValidationSchema.create), auth.hasRole('pharmacist'), controller.create)
router.post('/getSentRequests', auth.hasRole('pharmacist'), controller.getSentRequests)
router.post('/getPatientPendingRequests', auth.hasRole('patient'), controller.getPendingRequests)
router.post('/approve', auth.hasRole('patient'), controller.approve)

module.exports = router
