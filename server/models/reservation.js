let mongoose = require('mongoose');

let reservationModel = mongoose.Schema({
    firstName: String,
    surname: String,
    email: String,
    roomNumber: Number,
    status: String,
    dateCreated: Date,
    dateUpdated: Date
}, {
    collection: 'reservations'
});

module.exports = mongoose.model('Reservation', reservationModel);

