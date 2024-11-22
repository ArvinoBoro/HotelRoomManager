let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let Listings = require('../models/listing');

/* Display the hotel room listings */ 
router.get('/', async(req, res, next) => {
    try {
        const listings = await Listings.find();
        console.log(listings);
        res.render('listings/list', {
            title: 'Listings',
            listings: listings
        })}
        catch(err){
            console.error(err);
            res.render('listings/list', {
                error: 'Error on the server'
            })
        }
});

module.exports = router; 