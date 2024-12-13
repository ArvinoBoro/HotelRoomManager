let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let Listings = require('../models/listing');
let path = require('path');
let fs = require('fs');

/* Display the hotel room listings */ 
router.get('/', async(req, res, next) => {
    try {
        let listings = await Listings.find();
        let imageDir = path.join(__dirname, '../../public/images');
        let images = fs.readdirSync(imageDir).sort();
        let queryParam = req.query.message;

        res.render('listings/list', {
            title: 'Listings',
            Listings: listings,
            Images: images,
            queryParam: queryParam
        });
    }
        catch(err){
            console.error(err);
            res.render('listings/list', {
                error: 'Error on the server'
            });
        }
});

router.get('/add', async(req, res, next) => {

    try {
        let queryParam = req.query.message;
        let previousListing = await Listings.findOne().sort({dateCreated: -1} ).exec(); // Finds the previously created listing. 
        res.render('listings/add', {
            title: 'Add Listing',
            previousListing: previousListing,
            queryParam: queryParam
        });
    }
    catch(err)
    {
        console.error(err);
        res.render('listings/list', {
            error:'Error on the server'
        });
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
            price: req.body.price,
            roomNumber: req.body.roomNumber,
            size: req.body.size,
            type: req.body.type,
            view: req.body.view
        });

        Listings.create(newListing).then(() => {
            res.redirect('/listings/add?message=add_success');
        });
    }
    catch(err)
    {
        console.error(err);
        res.redirect('/listings/add?message=failure');
    }
});

router.get('/edit/:id', async(req, res, next) => { 
    
    try {
        const id = req.params.id;
        const listingToEdit = await Listings.findById(id); 
        res.render('listings/edit', { 
            title: 'Edit Listing',
            Listing: listingToEdit 
        });
    }
    catch(err) {
        console.error(err);
        next(err);
    }
});

router.post('/edit/:id', async(req, res, next) => {
    try {
        let id = req.params.id;
        let updatedListing = Listings({
            _id: id,
            availability: req.body.availability,
            dateUpdated: new Date(),
            addedNotes: req.body.addedNotes,
            floor: req.body.floor,
            roomNumber: req.body.roomNumber,
            size: req.body.size,
            type: req.body.type,
            view: req.body.view
        });
        Listings.findByIdAndUpdate(id, updatedListing).then(() => {
            res.redirect('/listings?message=edit_success');
        });
    }
    catch(err) {
        console.error(err);
        next(err);
    }
});

router.get('/delete/:id', async(req, res, next) => {
    try {
        let id = req.params.id;
        Listings.deleteOne({_id:id}).then(() => {
            res.redirect('/listings?message=delete_success');
        })
    }
    catch(error) {
        console.error(err);
        res.redirect('/listings?message=failure');
    }
});



module.exports = router; 