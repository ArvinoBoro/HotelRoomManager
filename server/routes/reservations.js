let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let Reservations = require('../models/reservation');

/* Display the hotel room reservations */ 
router.get('/', async(req, res, next) => {
    try {
        const reservations = await Reservations.find();
        console.log(reservations);
        res.render('reservations/list', {
            title: 'Reservations',
            reservations: reservations
        })}
        catch(err){
            console.error(err);
            res.render('reservations/list', {
                error: 'Error on the server'
            })
        }
});

module.exports = router; 