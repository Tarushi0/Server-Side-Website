var express = require('express');
var router = express.Router();

// Define the route for the home page
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Define the route for the about page
router.get('/about', (req, res) => {
  // Implement your logic for rendering the about page
  res.render('about', { title: 'About Page' });
});

// Define the route for the help page
router.get('/help', (req, res) => {
  // Implement your logic for rendering the help page
  res.render('help', { title: 'Help Page' });
});

module.exports = router;
