const express = require('express');
const router = express.Router();
const wrapAsync = require('../Utils/wrapAsync.js');
const {
    isLoggedIn,
    isOwnerRole,
    isUserRole,
    validateBooking,
    validateBookingStatus
} = require('../middleware.js');
const bookingController = require('../controllers/bookings.js');

router.get('/guest', isLoggedIn, isUserRole, wrapAsync(bookingController.guestBookings));
router.get('/owner', isLoggedIn, isOwnerRole, wrapAsync(bookingController.ownerBookings));
router.put('/:bookingId/status', isLoggedIn, isOwnerRole, validateBookingStatus, wrapAsync(bookingController.updateBookingStatus));
router.put('/:bookingId/cancel', isLoggedIn, isUserRole, wrapAsync(bookingController.cancelBooking));

module.exports = router;
