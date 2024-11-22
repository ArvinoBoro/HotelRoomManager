let mongoose = require('mongoose');

let listingModel = mongoose.Schema({
    availability: Boolean,
    dateCreated: Date,
    dateUpdated: Date,
    description: String,
    floor: Number,
    price: Number, 
    roomNumber: Number,
    size: Number,
    type: String
}, {
    collection: 'listings'
});

module.exports = mongoose.model('Listing', listingModel);



