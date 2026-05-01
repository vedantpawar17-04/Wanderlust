const Booking = require('../models/booking.js');
const Listing = require('../models/listing.js');
const Notification = require('../models/notification.js');
const ExpressError = require('../Utils/ExpressError.js');

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function normalizeDate(value) {
    const date = new Date(value);
    date.setHours(0, 0, 0, 0);
    return date;
}

function calculateNights(checkIn, checkOut) {
    return Math.ceil((checkOut - checkIn) / MS_PER_DAY);
}

module.exports.createBooking = async (req, res, next) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id).populate('owner', 'username');

        if (!listing) {
            req.flash('error', 'Listing not found.');
            return res.redirect('/listings');
        }

        if (listing.owner && listing.owner._id.equals(req.user._id)) {
            req.flash('error', 'Owners cannot book their own listings.');
            return res.redirect(`/listings/${id}`);
        }

        const checkIn = normalizeDate(req.body.booking.checkIn);
        const checkOut = normalizeDate(req.body.booking.checkOut);
        const today = normalizeDate(new Date());
        const nights = calculateNights(checkIn, checkOut);

        if (Number.isNaN(checkIn.getTime()) || Number.isNaN(checkOut.getTime())) {
            throw new ExpressError(400, 'Please select valid booking dates.');
        }

        if (checkIn < today) {
            throw new ExpressError(400, 'Check-in date cannot be in the past.');
        }

        if (checkOut <= checkIn || nights < 1) {
            throw new ExpressError(400, 'Check-out date must be after check-in date.');
        }

        const conflictingBooking = await Booking.findOne({
            listing: listing._id,
            status: { $in: ['pending', 'confirmed'] },
            checkIn: { $lt: checkOut },
            checkOut: { $gt: checkIn }
        });

        if (conflictingBooking) {
            req.flash('error', 'These dates are not available. Please choose different dates.');
            return res.redirect(`/listings/${id}`);
        }

        const totalPrice = nights * (listing.price || 0);

        const booking = new Booking({
            user: req.user._id,
            listing: listing._id,
            checkIn,
            checkOut,
            totalPrice,
            status: 'pending'
        });

        await booking.save();

        if (listing.owner && listing.owner._id) {
            await Notification.create({
                recipient: listing.owner._id,
                type: 'booking',
                message: `${req.user.username} booked "${listing.title}" from ${checkIn.toLocaleDateString('en-US')} to ${checkOut.toLocaleDateString('en-US')}.`,
                link: '/bookings/owner',
                isRead: false
            });
        }

        req.flash('success', 'Booking request created successfully.');
        res.redirect('/bookings/guest');
    } catch (err) {
        next(err);
    }
};

module.exports.guestBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find({ user: req.user._id })
            .populate({
                path: 'listing',
                populate: {
                    path: 'owner',
                    select: 'username'
                }
            })
            .sort({ createdAt: -1 });

        res.render('bookings/guest.ejs', {
            bookings,
            currUser: req.user || null
        });
    } catch (err) {
        next(err);
    }
};

module.exports.ownerBookings = async (req, res, next) => {
    try {
        const ownerListings = await Listing.find({ owner: req.user._id }).select('_id title');
        const listingIds = ownerListings.map((listing) => listing._id);

        const bookings = await Booking.find({ listing: { $in: listingIds } })
            .populate('user', 'username email')
            .populate('listing', 'title price location country')
            .sort({ createdAt: -1 });

        res.render('bookings/owner.ejs', {
            bookings,
            currUser: req.user || null
        });
    } catch (err) {
        next(err);
    }
};

module.exports.updateBookingStatus = async (req, res, next) => {
    try {
        const { bookingId } = req.params;
        const { status } = req.body.booking;
        const booking = await Booking.findById(bookingId)
            .populate('listing')
            .populate('user', 'username');

        if (!booking) {
            req.flash('error', 'Booking not found.');
            return res.redirect('/bookings/owner');
        }

        if (!booking.listing.owner.equals(req.user._id)) {
            req.flash('error', 'You can only manage bookings for your own listings.');
            return res.redirect('/bookings/owner');
        }

        booking.status = status;
        await booking.save();

        if (booking.user && booking.user._id) {
            const guestMessageMap = {
                confirmed: `Your booking for "${booking.listing.title}" has been confirmed by the owner.`,
                cancelled: `Your booking for "${booking.listing.title}" has been cancelled by the owner.`,
                pending: `Your booking for "${booking.listing.title}" is now pending review.`
            };

            await Notification.create({
                recipient: booking.user._id,
                type: 'booking-status',
                message: guestMessageMap[status] || `Your booking for "${booking.listing.title}" has been updated.`,
                link: '/bookings/guest',
                isRead: false
            });
        }

        req.flash('success', `Booking marked as ${status}.`);
        res.redirect('/bookings/owner');
    } catch (err) {
        next(err);
    }
};

module.exports.cancelBooking = async (req, res, next) => {
    try {
        const { bookingId } = req.params;
        const booking = await Booking.findById(bookingId);

        if (!booking) {
            req.flash('error', 'Booking not found.');
            return res.redirect('/bookings/guest');
        }

        if (!booking.user.equals(req.user._id)) {
            req.flash('error', 'You can only cancel your own booking.');
            return res.redirect('/bookings/guest');
        }

        booking.status = 'cancelled';
        await booking.save();

        req.flash('success', 'Booking cancelled successfully.');
        res.redirect('/bookings/guest');
    } catch (err) {
        next(err);
    }
};
