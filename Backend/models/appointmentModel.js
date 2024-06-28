const mongoose = require("mongoose")

const appointmentSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: [true, 'inventory type require'],
    },
    date: {
        type: Date,
        required: [true, 'Date is required']
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: [true, 'doctorName is required']
    },
    timeslot: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/.test(v);
            },
            message: props => `${props.value} is not a valid time format!`
        }
    }
})

module.exports = mongoose.model('appointment', appointmentSchema)