let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let Reservations = require('../models/reservation');
let Listings = require('../models/listing');

/* Display the hotel room reservations */ 
router.get('/', async(req, res, next) => {
    try {
        const reservations = await Reservations.find();

        reservations.sort((a, b) => a.surname.localeCompare(b.surname));

        res.render('reservations/list', {
            title: 'Reservations',
            reservations: reservations
        })}
        catch(err){
            console.error(err);
            res.render('reservations/list', {
                error: 'Error on the server'
            });
        }
});

router.get('/add/:id', async(req, res, next) => {
    try {
        let id = req.params.id;
        let reservation = await Listings.findById(id).exec();
        let roomNumber = reservation.roomNumber;

        console.log("Reserved room: ", roomNumber);

        res.render('reservations/add', {
            title: 'Make a Reservation',
            roomNumber: roomNumber,
            id: id
        });
    }
    catch(err)
    {
        console.error(err);
        res.render('reservations/list', {
            error:'Error on the server'
        })
    }
});

router.post('/add/:id', async(req, res, next) => {
    try {
        let id = req.params.id;
        let reservation = await Listings.findById(id).exec();
        let roomNumber = reservation.roomNumber;

        let newReservation = Reservations({
            firstName: req.body.firstName,
            surname: req.body.surname,
            email: req.body.email,
            roomNumber: roomNumber,
            dateCreated: new Date(),
            dateUpdated: new Date(),
            status: "pending",
            startDate: req.body.startDate,
            endDate: req.body.endDate
        });

        Reservations.create(newReservation).then(() => {
            res.redirect('/reservations');
        })
        console.log(newReservation);
    }
    catch(err)
    {
        console.error(err);
        res.render('/reservations', {
            error:'Error on the server'
        })
    }
});

router.get('/edit/:id', async(req, res, next) => { 
    try {
        const id = req.params.id;
        const reservationToEdit = await Reservations.findById(id); 
        res.render('reservations/edit', { 
            title: 'Edit Reservation',
            Reservation: reservationToEdit 
        })
    }
    catch(err) {
        console.error(err);
        next(err);
    }
});

router.post('/edit/:id', async(req, res, next) => {
    try {
        let id = req.params.id;
        let updatedReservation = Reservations({
            _id: id,
            firstName: req.body.firstName,
            surname: req.body.surname,
            email: req.body.email,
            dateUpdated: new Date(),
            status: req.body.status,
            startDate: req.body.startDate,
            endDate: req.body.endDate
        });
        console.log(updatedReservation);
        Reservations.findByIdAndUpdate(id, updatedReservation).then(() => {
            res.redirect('/reservations');
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
        Reservations.deleteOne({_id:id}).then(() => {
            res.redirect('/reservations')
        })
    }
    catch(error) {
        console.error(err);
        res.render('/reservations',{
            error:'Error on the server'
        })
    }
});



module.exports = router; 