# WanderLust - Full-Stack Airbnb-Inspired Booking Platform

WanderLust is a full-stack travel stay platform where users can discover properties, save favorites, book stays with date selection, and receive real-time-style booking updates through an in-app notification system. It is built with Node.js, Express, MongoDB, EJS, and a clean MVC architecture.

## Why This Project Stands Out

This project goes beyond basic CRUD and demonstrates product thinking, backend business logic, and user-focused UX:

- Smart booking flow with check-in/check-out selection
- Availability-aware reservations with overlap prevention
- Role-based dashboards for both guests and owners
- In-app notification bell for booking requests and booking confirmations
- Wishlist and trip planning features for return-user engagement
- Review system with owner-side reporting and analytics

## Recruiter Highlights

- Built a real booking workflow with validation, date rules, and conflict detection
- Designed separate user journeys for guests and property owners
- Implemented notification-based status updates when owners confirm bookings
- Added wishlist and trip-planning behavior to make the app feel like a real product
- Structured the codebase using MVC, middleware, reusable validation, and protected routes

## Core Features

### 1. Authentication and Role-Based Access

- Sign up, log in, and log out with Passport.js
- Session persistence with MongoDB
- Separate roles for `owner` and `user`
- Protected routes and ownership checks

### 2. Listings Marketplace

- Create, edit, and delete property listings
- Upload listing images with Cloudinary and Multer
- Browse detailed property pages with host info and reviews
- Search stays by title, location, or country
- Filter listings by country and price range

### 3. Smart Booking System

- Native check-in and check-out date picker on listing pages
- Booking availability display for already reserved dates
- Reservation requests for logged-in users
- Booking conflict prevention to block overlapping stays
- Total price calculation based on number of nights
- Booking lifecycle with `pending`, `confirmed`, and `cancelled` statuses

### 4. Guest and Owner Booking Dashboards

- Guests can track upcoming stays and booking history
- Owners can review and manage incoming reservation requests
- Booking status updates are reflected in each user's flow

### 5. Notifications System

- Notification bell in the navbar for logged-in users
- Owners receive alerts when a new booking is requested
- Guests receive alerts when an owner confirms or updates a booking
- Unread notification badge count for quick visibility

### 6. Reviews, Ratings, and Reporting

- Authenticated users can submit reviews
- Owners cannot review their own listings
- Rating summaries and analytics support better listing management

### 7. Wishlist and Trip Planner

- Save listings to a personal wishlist
- Organize stays for future travel planning
- Add trip notes for saved properties

## Tech Stack

- Backend: Node.js, Express, MongoDB, Mongoose
- Frontend templating: EJS, ejs-mate
- Authentication: Passport.js, passport-local-mongoose
- File uploads: Multer, Cloudinary
- Validation: Joi
- Sessions and flash messages: express-session, connect-mongo, connect-flash
- UI: Bootstrap, custom CSS, client-side JavaScript

## Architecture and Engineering Focus

- MVC folder structure for separation of concerns
- Middleware-driven auth and validation
- Server-side rendered UI with reusable partials
- Strong booking logic using date normalization and overlap checks
- Flash feedback and guarded actions for a smoother user experience

## Project Structure

```text
controllers/     # Business logic for listings, bookings, notifications, users, reviews
models/          # Mongoose schemas
routes/          # Express route definitions
views/           # EJS templates and reusable partials
public/          # CSS, JavaScript, images
Utils/           # Error helpers and async wrappers
app.js           # Express app entry point
schema.js        # Joi validation schemas
cloudConfig.js   # Cloudinary configuration
```

## Key User Flows

### Guest Flow

- Browse listings
- Search and filter stays
- Open a property page
- Select check-in and check-out dates
- Create a booking request
- Track booking status in My Trips
- Receive a notification when the owner confirms the booking

### Owner Flow

- Create and manage listings
- Review reservation requests
- Confirm or cancel bookings
- Receive booking request notifications
- Monitor listing performance and reviews

## Key Routes

- `GET /listings` - Browse all listings
- `GET /listings/search` - Search and filter listings
- `GET /listings/:id` - Listing detail page
- `POST /listings/:id/bookings` - Create booking request
- `GET /bookings/guest` - Guest booking dashboard
- `GET /bookings/owner` - Owner booking dashboard
- `PUT /bookings/:bookingId/status` - Owner updates booking status
- `GET /notifications` - Notifications center
- `POST /wishlist/listings/:id` - Save listing to wishlist
- `POST /listings/:id/reviews` - Add review

## Local Setup

### Prerequisites

- Node.js `22.9.0`
- MongoDB local instance or MongoDB Atlas
- Cloudinary account

### Environment Variables

Create a `.env` file in the project root:

```env
CLOUD_NAME=your_cloudinary_name
CLOUD_API_KEY=your_cloudinary_key
CLOUD_API_SECRET=your_cloudinary_secret
SECRET=your_session_secret
ATLASDB_URL=your_mongodb_atlas_url
```

### Install and Run

```bash
npm install
node app.js
```

Open: `http://localhost:3030/listings`

## What This Demonstrates

WanderLust shows my ability to build a feature-rich full-stack application with:

- Business logic beyond CRUD
- Secure authentication and authorization
- Real-world booking and reservation handling
- Clear user-role separation
- End-to-end feature ownership from database to UI

## Future Enhancements

- Automated tests with Jest and Supertest
- Payment integration for checkout
- Calendar UI with blocked-date visualization
- Pagination and more advanced search facets
- Deployment pipeline with CI/CD

## Notes for Recruiters

If you want to assess practical engineering ability, this project is a strong example of how I approach product realism, backend logic, access control, and user experience together, not as isolated features.
