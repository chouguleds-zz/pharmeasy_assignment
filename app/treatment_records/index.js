'use strict'

const express = require('express')
const router = express.Router()
const controller = require('./treatment_records.controller')
const validator = require('../../lib/validator')
const treatmentRecordValidationSchema = require('./treatment_record.validation')
const auth = require('../../auth/auth.service.js')

router.post('/create', validator(treatmentRecordValidationSchema.create), auth.hasRole('doctor'), controller.create)
router.post('/viewRecord', auth.hasRole('patient'), controller.viewRecord)

module.exports = router
