/*
 * Async Error Handler Utility
 * Wraps async route handlers to automatically catch errors
 * Eliminates the need for try-catch blocks in every async route
 * 
 * @param {Function} fn - The async function/route handler to wrap
 * @returns {Function} Wrapped function that automatically passes errors to next()
 */
module.exports = (fn) => {
    return (req, res, next) => {
        // Execute the function and catch any errors, passing them to next()
        fn(req, res, next).catch(next);
    }
}