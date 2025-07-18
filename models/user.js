/**
 * User Model for the application
 * Represents registered users in the system
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

/**
 * User Schema Definition
 * - email: Unique identifier for the user (required and unique)
 * - registerDate: Date when the user registered
 * 
 * Note: passport-local-mongoose automatically adds:
 * - username field
 * - password field (hash & salt)
 * - methods for authentication
 */
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,  // Ensure email is unique
    },
    registerDate: {
        type: Date,
        default: Date.now
    }
});

// Configure passport-local-mongoose plugin for authentication
// This adds username, hash, salt fields and authentication methods
userSchema.plugin(passportLocalMongoose);

// Export the model to be used in other parts of the application
module.exports = mongoose.model('User', userSchema);