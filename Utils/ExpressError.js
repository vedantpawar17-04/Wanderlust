/*
 * Custom Error Class for Express Applications
 * Extends the built-in Error class with additional properties
 * Used for consistent error handling throughout the application
 */
class ExpressError extends Error 
{
    /*
     * Create a new ExpressError
     * @param {number} statusCode - HTTP status code for the error response 
     * @param {string} message - Error message to display to the user
     */
    constructor(statusCode, message) 
    {
        super();
        this.statusCode = statusCode;
        this.message = message;
    }
}

// Export the class to be used in other parts of the application
module.exports = ExpressError;