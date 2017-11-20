'use strict'

const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema({

  name: String,
  email: {
    type: String,
    unique: {
      message: 'email must be unique.'
    }
  },
  gender: {
    type: String,
    enum: ['male', 'female']
  },
  password: String,
  role: {
    type: String,
    enum: ['patient', 'doctor', 'pharmacist']
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

UserSchema.methods = {

  authenticate: function (planeText) {

    return bcrypt.compareSync(planeText, this.password)
  }
}
module.exports = mongoose.model('User', UserSchema)
