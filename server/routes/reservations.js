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
        let room = await Listings.findOne({_id: id, availability: true});

        if(room) {
            let roomNumber = room.roomNumber;

            console.log("Reserved room:", roomNumber);

            res.render('reservations/add', {
                title: 'Make a Reservation',
                roomNumber: roomNumber,
                id: id
            }); 

        } else {
            res.redirect('/listings');
        }
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
        let room = await Listings.findOne({_id: id, availability: true});
        
        if(room) {
            let roomNumber = room.roomNumber;
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
            });
            console.log("New Reservation:", newReservation);


        } else {
            res.redirect('/listings'); 
        }

    }
    catch(err)
    {
        console.error(err);
        res.render('/reservations', {
            error:'Error on the server'
        });
    }
});

router.get('/edit/:id', async(req, res, next) => { 
    try {
        let id = req.params.id;
        let reservationToEdit = await Reservations.findById(id); 

        if(reservationToEdit) {
            res.render('reservations/edit', { 
                title: 'Edit Reservation',
                Reservation: reservationToEdit,

            });
        } else {
            res.redirect('/reservations');
        }
    }
    catch(err) {
        console.error(err);
        next(err);
    }
});

router.post('/edit/:id', async(req, res, next) => {
    try {
        let id = req.params.id;
        let reservationToEdit = await Reservations.findById(id); 

        if(reservationToEdit) {
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
            console.log("Updated reservation:", updatedReservation);
            Reservations.findByIdAndUpdate(id, updatedReservation).then(() => {
                res.redirect('/reservations');
            });    

            if(req.body.status == 'accepted' || req.body.status == 'ongoing') {
                let roomNumber = reservationToEdit.roomNumber;

                await Listings.updateOne({roomNumber: roomNumber}, {$set: {availability: false}});
            }

        } else {
            res.redirect('/reservations');
        }
    }
    catch(err) {
        console.error(err);
        next(err);
    }
});

router.get('/delete/:id', async(req, res, next) => {
    try {
        let id = req.params.id;
        let reservationToDelete = await Reservations.findById(id); 
        
        if(reservationToDelete) {
            Reservations.deleteOne({_id:id}).then(() => {
                res.redirect('/reservations')
            });
        } else {
            res.redirect('/reservations');
        }
    }
    catch(error) {
        console.error(err);
        res.render('/reservations',{
            error:'Error on the server'
        });
    }
});



module.exports = router; 