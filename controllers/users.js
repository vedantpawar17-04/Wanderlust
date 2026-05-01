const User = require('../models/user.js');
const Listing = require('../models/listing.js');
const Review = require('../models/review.js');
const WishlistItem = require('../models/wishlistItem.js');


module.exports.renderSignupForm=(req,res)=>{
    res.render('users/signup.ejs');
}

module.exports.signup=(async(req,res)=>{
    try {
        let {username,email,password,role}=req.body;
        const normalizedRole = ['user', 'owner'].includes(role) ? role : 'user';
        const newUser = new User({
            email,
            username,
            role: normalizedRole,
            registerDate: Date.now()
        });
        const registerUser=await User.register(newUser,password);
        console.log("Registration successful!!", registerUser);
        //When the login operation completes, user will be assigned to req.user.
        req.login(registerUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash('success',"Welcome To Wanderlust!!");
            res.redirect('/listings');
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
})

module.exports.renderLoginForm=(req,res)=>{
    res.render('users/login.ejs');
}

module.exports.login=async(req,res)=>{
    const selectedRole = ['user', 'owner'].includes(req.body.role) ? req.body.role : 'user';

    if (!req.user || req.user.role !== selectedRole) {
        req.logout((err) => {
            if (err) {
                console.error('Error logging out after role mismatch:', err);
            }
        });
        req.flash('error', `This account is registered as ${req.user && req.user.role ? req.user.role : 'a different role'}. Please select the correct role.`);
        return res.redirect('/login');
    }

    // res.send('Welcome To Wanderlust!You Are Logged In!');
    req.flash('success', "Welcome To Wanderlust !!!");
    //Always Uses Locals With response
    let redirectUrl = res.locals.redirectUrl || '/listings';
    res.redirect( redirectUrl );
}

module.exports.logout=async (req, res) => {
    //Invoking logout() will remove the req.user property and clear the login session (if any).
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Logged Out Successfully!');
        res.redirect('/listings');
    });
}

module.exports.profile = async (req, res, next) => {
    try {
        // Check if user exists
        if (!req.user) {
            req.flash('error', 'You need to be logged in to view your profile');
            return res.redirect('/login');
        }

        // Safely find user listings with error handling
        let userListings = [];
        try {
            userListings = await Listing.find({ owner: req.user._id }).exec();
        } catch (listingErr) {
            console.error("Error fetching user listings:", listingErr);
            // Continue execution, don't break the profile page
        }

        // Safely find user reviews with error handling
        let userReviews = [];
        try {
            userReviews = await Review.find({ author: req.user._id })
                .populate({
                    path: 'listing',
                    select: 'title'
                })
                .exec();
        } catch (reviewErr) {
            console.error("Error fetching user reviews:", reviewErr);
            // Continue execution, don't break the profile page
        }

        let wishlistItems = [];
        try {
            wishlistItems = await WishlistItem.find({ user: req.user._id })
                .populate('listing')
                .sort({ createdAt: -1 })
                .limit(4)
                .exec();
        } catch (wishlistErr) {
            console.error("Error fetching wishlist items:", wishlistErr);
        }
        
        // Render profile with user data
        return res.render('users/profile.ejs', { 
            userListings: userListings || [], 
            userReviews: userReviews || [],
            userRole: req.user.role || 'user',
            recentWishlistItems: wishlistItems || []
        });
    } catch (err) {
        console.error("Error loading profile:", err);
        req.flash('error', 'Something went wrong loading your profile');
        return res.redirect('/listings');
    }
}

module.exports.updateProfileImage = async (req, res, next) => {
    try {
        if (!req.user) {
            req.flash('error', 'You need to be logged in to update your profile picture.');
            return res.redirect('/login');
        }

        if (!req.file) {
            req.flash('error', 'Please choose an image to upload.');
            return res.redirect('/profile');
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            req.flash('error', 'User not found.');
            return res.redirect('/profile');
        }

        user.profileImage = {
            url: req.file.path,
            filename: req.file.filename
        };

        await user.save();
        req.flash('success', 'Profile picture updated successfully.');
        res.redirect('/profile');
    } catch (err) {
        next(err);
    }
};
