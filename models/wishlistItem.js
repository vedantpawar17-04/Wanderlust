const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const wishlistItemSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    listing: {
        type: Schema.Types.ObjectId,
        ref: 'Listing',
        required: true
    },
    collectionName: {
        type: String,
        default: 'My Wishlist',
        trim: true
    },
    tripNote: {
        type: String,
        default: '',
        trim: true
    }
}, {
    timestamps: true
});

wishlistItemSchema.index({ user: 1, listing: 1 }, { unique: true });

module.exports = mongoose.model('WishlistItem', wishlistItemSchema);
