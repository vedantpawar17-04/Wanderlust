/**
 * Schema Validation Module
 * Defines Joi validation schemas for the application data
 * Used for validating user input before processing
 */
const Joi=require('joi');

/**
 * Listing Schema Validation
 * Validates new and updated listing data with the following fields:
 * - title: Required string for the listing title
 * - description: Required string for listing details
 * - location: Required string for the geographic location
 * - country: Required string for the country
 * - price: Required number between 0 and 100000
 * - image: Optional string for image data
 */
module.exports.listingSchema = Joi.object({
    listing :Joi.object({
        title:Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0).max(100000),
        image: Joi.string().allow("",null)
    }).required(),
});

/**
 * Review Schema Validation
 * Validates review data with the following fields:
 * - rating: Required number between 1 and 5
 * - comment: Required string for the review content
 */
module.exports.reviewSchema=Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required()
    }).required(),
})