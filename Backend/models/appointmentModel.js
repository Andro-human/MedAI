const mongoose = require("mongoose")

const appointmentSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: [true, 'Patient is required'],
    },
    date: {
        type: Date,
        required: [true, 'Date is required']
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: [true, 'doctor is required']
    },
})

module.exports = mongoose.model('appointment', appointmentSchema)