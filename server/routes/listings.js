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

router.get('/add', async(req, res, next) => {
    try {
        let previousListing = await Listings.findOne().sort({dateCreated: -1} ).exec(); // Finds the previously created listing. 
        console.log(previousListing);
        res.render('listings/add', {
            title: 'Add Listing',
            previousListing: previousListing
        });
    }
    catch(err)
    {
        console.error(err);
        res.render('listings/list', {
            error:'Error on the server'
        })
    }
});

router.post('/add', async(req, res, next) => {
    try {
        let newListing = Listings({
            availability: req.body.availability,
            dateCreated: new Date(),
            dateUpdated: new Date(),
            addedNotes: req.body.addedNotes,
            floor: req.body.floor,
            roomNumber: req.body.roomNumber,
            size: req.body.size,
            type: req.body.type,
            view: req.body.view
        });

        Listings.create(newListing).then(() => {
            res.redirect('/listings/add');
        })
        console.log(newListing);
    }
    catch(err)
    {
        console.error(err);
        res.render('/listings', {
            error:'Error on the server'
        })
    }
});


module.exports = router; 