const express = require('express');
const bookingRouter = express.Router();
const Booking = require('../../models/booking.js');

// Route to render the booking creation form
bookingRouter.get('/create', (req, res) => {
    res.render('bookings', { title: 'Booking Page' });
});

// Route to handle the submission of the booking creation form
bookingRouter.post('/create', (req, res, next) => {
    // Create a new booking using the data from the request body
    Booking.create(req.body)
        .then((bookingCreated) => {
            // Pass the booking ID to the success page
            res.render('complete', { title: 'Booking successful!', bookingId: bookingCreated._id });
        })
        .catch((err) => next(err));
});

// Route to display a list of all bookings
bookingRouter.get('/list', (req, res, next) => {
    Booking.find()
        .then((bookingsFound) => {
            if (bookingsFound.length > 0) {
                res.render('reports', { "bookinglist": bookingsFound, title: 'All Bookings' });
            } else {
                res.render('failure', { title: 'complete page' });
            }
        })
        .catch((err) => next(err));
});

// Route to handle the deletion of a booking
bookingRouter.get('/delete', (req, res) => {
    res.render('delete', { title: 'delete page' });
});

// Route to handle the submission of the booking deletion form
bookingRouter.post('/delete', (req, res, next) => {
    const bookingIdToDelete = req.body.bookingId;

    // Find the booking by ID and delete it
    Booking.findByIdAndDelete(bookingIdToDelete)
        .then(() => {
            res.redirect('/bookings/list');
        })
        .catch((err) => next(err));
});

// Route to handle the modification of a booking
bookingRouter.get('/modify', (req, res) => {
    res.render('modify', { title: 'modify page' });
});

// Route to handle the submission of the booking modification form
bookingRouter.post('/modify', (req, res, next) => {
    const bookingIdToModify = req.body.bookingId;
    const { newDate, newUsername, newDescription, newTime } = req.body;

    // Find the booking by ID and update its fields
    Booking.findById(bookingIdToModify)
        .then((booking) => {
            if (!booking) {
                res.status(404).send('Booking not found');
                return;
            }

            // Update the fields that need to be modified
            if (newDate) booking.date = newDate;
            if (newUsername) booking.username = newUsername;
            if (newDescription) booking.description = newDescription;
            if (newTime) booking.time = newTime;

            return booking.save();
        })
        .then((updatedBooking) => {
            // Render the success page after successful modification
            res.render('modify-suc', { title: 'Booking successful!' });
        })
        .catch((err) => next(err));
});

module.exports = bookingRouter;
