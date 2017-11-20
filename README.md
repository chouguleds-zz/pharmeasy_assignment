#### Problem statement:
Build an application where the User’s data can be shared only if they approve it.
There are three types of `users/roles`:
- Patient/User
- Doctor
- Pharmacist

The Patient has medical records and prescriptions. If a doctor asks for a patient’s prescription, the patient has to approve it. Same goes with the Pharmacist, if the pharmacist wants to view the patient’s prescription, the patient has to approve it.

#### Hosted backend has following base url

Base URL: `18.217.49.88:9000`
The postman collection is added in the git repository which has all the request saved in it and can be used to test the application.

### Technologies and the modules used:
* Technology: `Node.js` As the most of the operations in the application are `I/O`
* Web Framework: `Express.js`
* Database: `MongoDB`
* Validations: `Joi`
* Test: `Mocha, Chai, Sinon`
* ORM: `Mongoose`
* Authentication and Authorization: `JSON Web Token`
* Linting: `ESLint`

#### Additional Points:
* Application is built using latest node version with `async/await`.
* Authentication and authorization are handled.
* Validations are properly handled.
* Test cases are written.
* Linting is used.

#### `Database Schema`:
#### User:
```
{
  name: String,
  email: String, // unique
  gender: String,
  password: String,
  role: String, // possible values 'patient', 'doctor', 'pharmacist'
}
```
#### Appointment:
```
{
  patient: String // patient's email
  consulting_doctor: String // doctors's email
  from_time: Date,
  to_time: Date,
  status: String // possible values 'booked', 'completed', 'cancelled',
```

#### Treatment Records:
```
{
  appointment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  patient: String, // patient's email
  consulted_doctor: String, // doctor's email
  diagnosis: String,
  summery: String,
  date: Date,
  prescription: [{
    medication: String,
    from_date: Date,
    to_date: Date,
    instructions: String
  }]
}
```

#### Prescription View Requests:
```
{
  is_approved: Boolean,
  patient: String,
  request_by: String,
  filters: {
  // these are the filters which doctor or pharmacist can apply to view the medical record of the patient
    appointment_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment'
    },
    appointment_date: {
      type: String, possible values 'exact', 'range',
      exact: Date,
      range: {
        from: Date,
        to: Date
      }
    },
    consulted_doctor: String
  }
}
```
#### `Apis`:

##### `User Registration`:
This api is used to register the user as per the role.
```
Method: POST,
URL: /api/users/create,
Payload: {
	"name": "prem",
	"email":"prem@gmail.com",
	"password": "prem",
	"role": "pharmacist",
	"gender": "male"
},
Response: {
    "success": true/false,
    "message": "message"
}
```

##### `Login`:
This api will be used to authenticate the user. And after successful login it returns the `jwt token` which we need to send in the subsequent request in the headers with key `authorization`.
```
Method: POST,
URL: /auth/local,
payload: {
	"email": "chougule.ds@gmail.com",
	"password": "deepak"
},
response: {
    "success": true,
    "message": "login success.",
    "token": "json web token"
}
```

##### `Create Appointment`:
Using this api patient will create the appointment with following details.
```

Method: POST,
URL: /api/appointments/create,
Payload: {
	"patient": "chougule.ds@gmail.com",
	"consulting_doctor": "akash@gmail.com",
	"from_time": 1511081013000,
	"to_time":1511084613000
},
Headers: {
    "authorization": "jwt token"
},
Response: {
    "success": false,
    "message": "Appointment booked."
}
```

##### `Get All Doctor's Appointments`:
Using this api doctor can see all the appointments. This api is paginated.
```

Method: POST,
URL: /api/appointments/getAppointments,
Payload: {
    "limit": 10,
    "offset": 0
},
Headers: {
    "authorization": "jwt token"
},
Response: {
  "success": true,
  "appointments": [
      {
          "_id": "5a1147eb685a1482e6aa3cca",
          "updated_at": "2017-11-19T08:59:23.496Z",
          "created_at": "2017-11-19T08:59:23.496Z",
          "patient": "chougule.ds@gmail.com",
          "consulting_doctor": "akash@gmail.com",
          "from_time": "2017-11-19T08:43:33.000Z",
          "to_time": "2017-11-19T09:43:33.000Z",
          "status": "booked",
          "__v": 0,
          "patientField": {
              "name": "deepak",
              "email": "chougule.ds@gmail.com"
          }
      },
      {
          "_id": "5a12a26f86451790326ce321",
          "updated_at": "2017-11-20T09:37:56.625Z",
          "created_at": "2017-11-20T09:37:56.625Z",
          "patient": "chougule.ds@gmail.com",
          "consulting_doctor": "akash@gmail.com",
          "from_time": "2017-11-19T08:43:33.000Z",
          "to_time": "2017-11-19T09:43:33.000Z",
          "status": "booked",
          "__v": 0,
          "patientField": {
              "name": "deepak",
              "email": "chougule.ds@gmail.com"
          }
      }
  ]
}
```
##### `Create treatment record`:

After user completes an appointment with the doctor, Doctor will add the treatment record for that patient for the corresponding appointment with following details.
```
Method: POST,
URL: /api/treatment_records/create,
Payload: {
	"appointment_id": "5a1147eb685a1482e6aa3cca",
	"patient": "chougule.ds@gmail.com",
	"consulted_doctor": "akash@gmail.com",
	"diagnosis": "fever",
	"summery": "patient has high fever",
	"date": 1511081013000,
	"prescription": [{
		"medication": "crosine",
		"from_date": 1511081013000,
		"to_date": 1511953771000,
		"instructions": "daily one tablet"
	}]
},
Headers: {
    "authorization": "jwt token"
},
Response: {
    "success": true,
    "message": 'Request sent to the user.'
}
```

##### `Create Prescription View Request`:
If in case doctor or pharmacist wants to view the treatment records/prescriptions of the patient then they will use this api with following details. This apis will submit a request to the patient and is patient approves it then only they can view the records.

```
Method: POST,
URL: /api/presc_view_requests/create,
Payload: {
    "patient": "chougule.ds@gmail.com",
    "filters": {
 	    // here they can use multiple filters as specified earlier
    }
},
Headers: {
    "authorization": "jwt token"
},
Response: {
    "success": true,
    "message": 'Request sent to the user.'
}
```

##### `Get pending prescription view requests for patient`:
This api will be used by the patient to check all the pending prescription view requests. And then user can choose to approve the request. This api is paginated.

```
Method: POST,
URL: /api/presc_view_requests/getPatientPendingRequests,
Payload: {
	"limit": 10, // for the pagination
	"offset": 0
},
Headers: {
    "authorization": "jwt token"
},
Response: {
    "success": true,
    "pendingRequests": [
        {
            "treatmentRecords": [
                {
                    "diagnosis": "fever",
                    "consulted_doctor": "akash@gmail.com",
                    "summery": "patient has high fever",
                    "prescription": [
                        {
                            "medication": "crosine",
                            "from_date": "2017-11-19T08:43:33.000Z",
                            "to_date": "2017-11-29T11:09:31.000Z",
                            "instructions": "daily one tablet",
                            "_id": "5a116adb93ff595210fdee28"
                        }
                    ],
                    "date": "2017-11-19T08:43:33.000Z",
                    "consultedDoctorField": {
                        "name": "akash",
                        "email": "akash@gmail.com",
                        "role": "doctor"
                    }
                }
            ],
            "pendingRequestId": "5a11ac5803bee33e53ef5d43",
            "requestBy": {
                "name": "akash",
                "email": "akash@gmail.com"
            }
        }
    ]
}
```

##### `Approve prescription view requests for patient`:
By using this api patient can approve a medical record view request.
```
Method: POST,
URL: /api/presc_view_requests/approve,
Payload: {
	"viewRequestId": "5a11b45aee75db6af7ac2989"
},
Headers: {
    "authorization": "jwt token"
},
Response: {
    "success": true,
    "message": 'Request approved.'
}
```

##### `Get sent prescription view requests (by doctor/pharmacist)`:
This api will be used by the doctor/pharmacist to view the status of the all the requests they have sent. And thus they can choose to view the medical records. This api is paginated.

```
Method: POST,
URL: /api/presc_view_requests/getSentRequests,
Payload: {
	"limit": 10, // used for the pagination.
	"offset": 0
},
Headers: {
    "authorization": "jwt token"
},
Response: {
    "success": true,
    "sentRequests": [
        {
            "_id": "5a11b45aee75db6af7ac2989",
            "patient": "chougule.ds@gmail.com",
            "request_by": "prem@gmail.com",
            "filters": {
                "consulted_doctor": "akash@gmail.com"
            },
            "is_approved": true
        }
    ]
}
```

##### `View treatment record (by doctor/pharmacist)`:
Once patient approves the request, doctor and the pharmacist can view the medical records of the patient based on the filters. This api is paginated.

```
Method: POST,
URL: /api/treatment_records/viewRecord,
Payload: {
    "request_id": "5a11b45aee75db6af7ac2989",
	"limit": 10, // used for the pagination.
	"offset": 0
},
Headers: {
    "authorization": "jwt token"
},
Response: {
    "success": true,
    "treatmentRecords": [
        {
            "diagnosis": "fever",
            "consulted_doctor": "akash@gmail.com",
            "summery": "patient has high fever",
            "prescription": [
                {
                    "medication": "crosine",
                    "from_date": "2017-11-19T08:43:33.000Z",
                    "to_date": "2017-11-29T11:09:31.000Z",
                    "instructions": "daily one tablet",
                    "_id": "5a116adb93ff595210fdee28"
                }
            ],
            "date": "2017-11-19T08:43:33.000Z",
            "consultedDoctorField": {
                "name": "akash",
                "email": "akash@gmail.com",
                "role": "doctor"
            }
        }
    ]
}
```
