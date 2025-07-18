/**
 * Cloudinary Configuration
 * Sets up cloud storage for image uploads in the application
 * Configures storage options and exports the necessary components
 */
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
//process.env=process environment

/**
 * Configure Cloudinary with credentials from environment variables
 * This authentication is required to use Cloudinary services
 */
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

/**
 * Configure Cloudinary Storage for Multer
 * This allows easy integration with Express file uploads
 * 
 * Settings:
 * - folder: Cloudinary folder where images will be stored
 * - allowedFormat: Permitted file formats for upload
 */
const storage =new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'Wanderlust',
    allowedFormat:["png","jpeg","jpg","pdf"],

  },
});

/**
 * Export the configured cloudinary instance and storage
 * These are used in route handlers for file uploads
 * 
 */
module.exports = {
cloudinary,
storage,
}