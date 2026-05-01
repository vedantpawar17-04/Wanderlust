const WishlistItem = require('../models/wishlistItem.js');
const Listing = require('../models/listing.js');

module.exports.index = async (req, res, next) => {
    try {
        const wishlistItems = await WishlistItem.find({ user: req.user._id })
            .populate({
                path: 'listing',
                populate: {
                    path: 'owner',
                    select: 'username'
                }
            })
            .sort({ createdAt: -1 });

        const groupedCollections = wishlistItems.reduce((acc, item) => {
            const key = item.collectionName || 'My Wishlist';
            if (!acc[key]) acc[key] = [];
            acc[key].push(item);
            return acc;
        }, {});

        res.render('wishlist/index.ejs', {
            wishlistItems,
            groupedCollections,
            currUser: req.user || null
        });
    } catch (err) {
        next(err);
    }
};

module.exports.addItem = async (req, res, next) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id);

        if (!listing) {
            req.flash('error', 'Listing not found.');
            return res.redirect('/listings');
        }

        const collectionName = (req.body.wishlist && req.body.wishlist.collectionName ? req.body.wishlist.collectionName : 'My Wishlist').trim() || 'My Wishlist';
        const tripNote = (req.body.wishlist && req.body.wishlist.tripNote ? req.body.wishlist.tripNote : '').trim();

        await WishlistItem.findOneAndUpdate(
            { user: req.user._id, listing: listing._id },
            {
                user: req.user._id,
                listing: listing._id,
                collectionName,
                tripNote
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        req.flash('success', 'Listing saved to your trip planner.');
        res.redirect(req.get('referer') || `/listings/${id}`);
    } catch (err) {
        next(err);
    }
};

module.exports.updateItem = async (req, res, next) => {
    try {
        const { wishlistId } = req.params;
        const item = await WishlistItem.findById(wishlistId);

        if (!item) {
            req.flash('error', 'Saved listing not found.');
            return res.redirect('/wishlist');
        }

        if (!item.user.equals(req.user._id)) {
            req.flash('error', 'You can only manage your own wishlist items.');
            return res.redirect('/wishlist');
        }

        item.collectionName = (req.body.wishlist.collectionName || 'My Wishlist').trim() || 'My Wishlist';
        item.tripNote = (req.body.wishlist.tripNote || '').trim();
        await item.save();

        req.flash('success', 'Trip planner item updated.');
        res.redirect('/wishlist');
    } catch (err) {
        next(err);
    }
};

module.exports.removeItem = async (req, res, next) => {
    try {
        const { wishlistId } = req.params;
        const item = await WishlistItem.findById(wishlistId);

        if (!item) {
            req.flash('error', 'Saved listing not found.');
            return res.redirect('/wishlist');
        }

        if (!item.user.equals(req.user._id)) {
            req.flash('error', 'You can only remove your own wishlist items.');
            return res.redirect('/wishlist');
        }

        await WishlistItem.findByIdAndDelete(wishlistId);
        req.flash('success', 'Listing removed from your trip planner.');
        res.redirect('/wishlist');
    } catch (err) {
        next(err);
    }
};
