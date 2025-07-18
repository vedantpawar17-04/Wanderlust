/*
 * Listing Model
 * Represents accommodation listings in the Airbnb-style application
 */
const mongoose= require('mongoose');
const Schema=mongoose.Schema;
const Review=require('./review.js');

/*
 * Listing Schema Definition
 * 
 * Fields:
 * - title: Name of the listing (required)
 * - description: Detailed description of the property
 * - image: Object containing URL and filename for the listing's image
 * - price: Cost per night
 * - location: Geographic location (city, area)
 * - country: Country where the listing is located
 * - reviews: Array of references to Review documents
 * - owner: Reference to the User who created the listing
 */
const listingSchema=new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,

    image: {
        url: String,
        filename: String,
    },

    price:Number,
    location:String,
    country:String,

    reviews:[
        {
            type : Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    }
});

/*
 * Middleware that runs after a listing is deleted
 * Ensures that when a listing is deleted, all its associated reviews are also deleted
 * Prevents orphaned review documents in the database
 */
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        {
           await Review.deleteMany({_id:{$in:listing.reviews}});
        }
    }
})

// Create the model from the schema
const Listing=mongoose.model('Listing',listingSchema);

// Export the model to be used elsewhere in the application
module.exports=Listing;