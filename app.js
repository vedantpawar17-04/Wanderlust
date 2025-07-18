//Basic Setup
const express=require('express');
const app=express();

//Dotenv Setup
if(process.env.NODE_ENV!=='production'){
require('dotenv').config();
}

//Method Override Setup
const methodOverride=require('method-override');
app.use(methodOverride('_method'));

//ejs-mate Setup
const ejsMate=require('ejs-mate');
app.engine('ejs',ejsMate);

//Extract The URL Data
app.use(express.urlencoded({ extended:true }));


//ExpressError 
const ExpressError=require('./Utils/ExpressError.js');

//Express-Session Required
const session = require('express-session');
const MongoStore= require("connect-mongo");

//Implementing A Flash
const flash=require('connect-flash');

//Passport Implementation
const passport = require('passport');
const LocalStrategy=require('passport-local');

//Requiring User Model
const User=require('./models/user.js');

//Require The Route
//For Listing
const listingRouter=require('./routes/listing.js');
//For Reviews
const reviewRouter=require('./routes/review.js');
//For User Routes
const userRouter=require('./routes/user.js');

//ejs setup
const path=require('path');
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

//mongoose Setup
const mongoose=require('mongoose');
const MONGO_URL='mongodb://localhost:27017/wanderlust';
async function main(){
    await mongoose.connect(MONGO_URL);
}
main().then(()=>{
    console.log('Connected To MongoDB');
}).catch((err)=>{
    console.error('Error Connecting To MongoDB',err);
});

//Serving A Static File
app.use(express.static(path.join(__dirname,'/public')));

const store = MongoStore.create({
    mongoUrl : MONGO_URL,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});

const sessionOptions={
    store:store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expire:Date.now()+60*60*1000,
        maxAge:60*60*1000,
        httpOnly:true, 
    }
};

app.use(session(sessionOptions));
app.use(flash());

//Passport Setup
app.use(passport.initialize());
//A Web Application Needs The Ability To Identify Users As They Browse From Page To Page.
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
//Generates a function that is used by Passport to serialize(Store User Data)users into the session.
passport.serializeUser(User.serializeUser());
// Generates a function that is used by Passport to deserialize(Remove User Data)users into the session.
passport.deserializeUser(User.deserializeUser());

//Flash and User Middleware
const Listing = require('./models/listing.js');

app.use(async (req, res, next) => {
    res.locals.success = req.flash('success'); 
    res.locals.error = req.flash('error');
    res.locals.currUser = req.user;
    res.locals.originalUrl = req.originalUrl;
    
    // Check if user has listings and fetch them
    if (req.user) {
        try {
            res.locals.userListings = await Listing.find({ owner: req.user._id });
        } catch (err) {
            console.error("Error fetching user listings:", err);
            res.locals.userListings = [];
        }
    }
    
    next();
});

//Routes
app.use('/', userRouter);
app.use('/listings',listingRouter);
app.use('/listings/:id/reviews',reviewRouter);

// Redirect root to listings
app.get('/', (req, res) => {
    res.redirect('/listings');
});

//Error Handling Middleware
app.use((err, req, res, next) => {
    console.error('ERROR:', err);
    
    let { statusCode = 500, message = "Something Went Wrong!" } = err;
    
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = err.message;
    } else if (err.name === 'CastError') {
        statusCode = 400;
        message = 'Invalid ID format';
    } else if (err.name === 'MongoServerError' && err.code === 11000) {
        statusCode = 400;
        message = 'This email is already registered';
    }
    
    req.flash('error', message);
    res.status(statusCode).render('listings/error.ejs', { message, statusCode });
});

//Server Setup - Moved to the end
app.listen(3030,()=>{
    console.log(`Server is running at http://localhost:3030/listings`);
});


