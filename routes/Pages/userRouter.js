const express = require('express');
const userRouter = express.Router();
const Booking = require('../../models/booking.js');

// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
    // Check if the user has an active session with a valid user ID
    if (req.session && req.session.userId) {
        // User is authenticated, proceed to the next middleware
        return next();
    } else {
        // User is not authenticated, redirect to the login page
        res.redirect('/users/login');
    }
}

// Route to render the login form
userRouter.get('/login', (req, res) => {
    res.render('login', { title: 'Login' });
});

// Route to handle login form submission
userRouter.post('/login', async (req, res) => {
    // Extract username and password from the request body
    const { username, password } = req.body;

    try {
        console.log('Attempting login with:', username, password);

        const user = await Booking.findOne({ username, password });

        if (user) {
            // Set the user ID in the session to indicate successful login
            req.session.userId = user.id;
            console.log('Login successful. Redirecting to /index');
            res.redirect('/');
        } else {
            console.log('Invalid username or password');
            // Render the login page with an error message
            res.render('login', { title: 'Login', errorMessage: 'Invalid username or password' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        // Render the login page with an error message
        res.render('login', { title: 'Login', errorMessage: 'Error during login' });
    }
});

// Route to handle user logout
userRouter.get('/logout', (req, res) => {
    // Clear the user ID from the session to indicate logout
    req.session.userId = null;
    // Redirect to the index page after logout
    res.redirect('/');
});

module.exports = userRouter;
