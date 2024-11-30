let mongoose = require('mongoose');

let listingModel = mongoose.Schema({
    availability: Boolean,
    dateCreated: Date,
    dateUpdated: Date,
    addedNotes: String,
    floor: Number,
    price: Number, 
    roomNumber: Number,
    size: Number,
    type: String,
    view: String
}, {
    collection: 'listings'
});

module.exports = mongoose.model('Listings', listingModel);



