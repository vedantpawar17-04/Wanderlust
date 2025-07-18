/*
 * Review Model
 * Represents user reviews for listings in the application
*/
const mongoose= require('mongoose');
const Schema=mongoose.Schema;

/*
 * Review Schema Definition
 * 
 * Fields:
 * - comment: Text content of the review
 * - rating: Numeric rating from 1 to 5
 * - createdAt: Timestamp when the review was created
 * - author: Reference to the User who wrote the review
 * - listing: Reference to the Listing being reviewed
*/
const reviewSchema=new Schema({
    comment: String,
    rating: 
    {
        type: Number, 
        min: 1, 
        max: 5
    },
    createdAt: {
        type:Date,
        default:Date.now(),
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    listing: {
        type: Schema.Types.ObjectId,
        ref: 'Listing'
    }
});

// Export the model to be used in other parts of the application
module.exports=mongoose.model("Review",reviewSchema);