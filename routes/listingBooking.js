const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../Utils/wrapAsync.js');
const { isLoggedIn, isUserRole, validateBooking } = require('../middleware.js');
const bookingController = require('../controllers/bookings.js');

router.post('/', isLoggedIn, isUserRole, validateBooking, wrapAsync(bookingController.createBooking));

module.exports = router;
