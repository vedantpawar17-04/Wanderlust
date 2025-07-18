const express=require('express');
const wrapAsync = require('../Utils/wrapAsync');
const passport = require('passport');
const router=express.Router();
// const User = require('../models/user.js');
const { saveRedirectUrl, isLoggedIn } = require("../middleware.js");

//User Controller For Listings
const userController=require('../controllers/users.js');

//Related Route Is User SignUp .
router.route('/signup')
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signup));

//Related Route Is login Page.
router.route('/login')
.get(userController.renderLoginForm)
.post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}),userController.login)

//Related Route Is logout
router.post('/logout',userController.logout);

// User Profile route
router.get('/profile', isLoggedIn, wrapAsync(async (req, res, next) => {
    try {
        if (!req.user) {
            req.flash('error', 'You need to log in to view your profile');
            return res.redirect('/login');
        }
        return userController.profile(req, res, next);
    } catch (err) {
        next(err);
    }
}));

module.exports=router;