# WanderLust (Airbnb‑Style Listings Platform)

A full‑stack web app that lets users discover, list, and review unique stays. Built with Node.js, Express, MongoDB, and server‑side EJS views, the project focuses on clean MVC architecture, secure authentication, and a polished user experience with search, filters, and analytics.

## Why This Project Stands Out

I built WanderLust to showcase real‑world product features beyond CRUD:
- Secure authentication and role‑based access (owners vs. guests)
- Cloudinary‑backed image uploads for listings
- Search + filter UX with dynamic pricing ranges
- Review system with rating analytics and a report dashboard
- Owner and user profile pages for content management

## Core Features

- **Authentication & sessions**
  - Sign up, log in, log out (Passport + passport‑local‑mongoose)
  - Session persistence using MongoDB (`connect-mongo`)
  - Flash messages for user feedback

- **Listings (Airbnb‑style)**
  - Create, edit, delete listings (protected by ownership checks)
  - Image upload to Cloudinary via Multer
  - Detailed listing pages with reviews and host info

- **Search & Filters**
  - Search by title, location, or country
  - Filter by country and price range (min/max)
  - Quick‑view modal for browsing

- **Reviews & Ratings**
  - Authenticated users can review listings
  - Owners cannot review their own listings
  - Average rating + distribution chart in owner report

- **Profiles & Owner Views**
  - User profile shows listings + reviews
  - Owner listing page for managing properties

- **Robust Validation & Error Handling**
  - Joi schemas validate listing/review payloads
  - Friendly error pages and flash feedback

## Tech Stack

- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Auth:** Passport.js, passport‑local‑mongoose
- **Views:** EJS + ejs‑mate layouts
- **Uploads:** Multer + Cloudinary
- **Validation:** Joi
- **Sessions & Flash:** express‑session, connect‑mongo, connect‑flash
- **UI:** Bootstrap + custom CSS

## Project Structure

```
controllers/     # Route handlers (listings, users, reviews)
models/          # Mongoose schemas (User, Listing, Review)
routes/          # Express routes
views/           # EJS templates
public/          # Static assets (CSS, client JS)
Utils/           # Error helpers and async wrappers
app.js           # App entry point
schema.js        # Joi validation schemas
cloudConfig.js   # Cloudinary config
```

## Data Models (Summary)

- **User**
  - `username` (added by passport‑local‑mongoose)
  - `email` (unique)
  - `registerDate`

- **Listing**
  - `title`, `description`, `price`, `location`, `country`
  - `image` `{ url, filename }`
  - `owner` (User reference)
  - `reviews` (array of Review references)

- **Review**
  - `rating` (1–5), `comment`, `createdAt`
  - `author` (User reference)
  - `listing` (Listing reference)

## Key Routes

- `GET /listings` — Browse all listings
- `GET /listings/search` — Search + filter
- `GET /listings/new` — Create listing form
- `POST /listings` — Create listing
- `GET /listings/:id` — Listing details + reviews
- `GET /listings/:id/edit` — Edit listing
- `PUT /listings/:id` — Update listing
- `DELETE /listings/:id` — Delete listing
- `GET /listings/:id/report` — Owner rating report dashboard
- `POST /listings/:id/reviews` — Add review
- `DELETE /listings/:id/reviews/:reviewId` — Delete review
- `GET /profile` — User profile
- `GET /signup` / `GET /login` — Auth

## Local Setup

### Prerequisites
- Node.js **22.9.0**
- MongoDB (local or Atlas)
- Cloudinary account

### Environment Variables
Create a `.env` file in the project root:

```
CLOUD_NAME=your_cloudinary_name
CLOUD_API_KEY=your_cloudinary_key
CLOUD_API_SECRET=your_cloudinary_secret
SECRET=your_session_secret

# Optional if you want Atlas instead of local MongoDB
ATLASDB_URL=your_mongodb_atlas_url
```

Keep `.env` private and never commit real credentials.

### Install & Run

```
npm install
node app.js
```

Open `http://localhost:3030/listings`

## Notes for Recruiters

This project demonstrates full‑stack ownership: database design, backend architecture, authentication flows, file handling, input validation, and UI/UX polish. I prioritized reliability (error handling, secure access controls) and scalability (clean MVC structure, reusable middleware).

## Future Enhancements

- Add automated tests (Jest/Supertest)
- Replace hardcoded Mongo URL with env‑driven config
- Add pagination and advanced search facets
- Deploy with Docker + CI/CD pipeline

---