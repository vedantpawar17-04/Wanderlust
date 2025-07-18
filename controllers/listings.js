/*  
 * Listings Controller
 * Handles all operations related to property listings including CRUD operations,
 * searching, filtering, and data display
 */
const Listing = require('../models/listing.js');
const {listingSchema}=require('../schema.js');
const ExpressError = require('../Utils/ExpressError');

/*  
 * Display all listings with optional filtering
 * Supports filtering by price range, category, and country
 * 
 * @param {Object} req - Express request object with query parameters for filtering
 * @param {Object} res - Express response object
 */
module.exports.index=async(req,res)=>{
    try {
        const { minPrice, maxPrice, category, country } = req.query;
        let query = {};

        // Build filter query based on user selections
        if (minPrice && !isNaN(minPrice)) {
            query.price = { $gte: Number(minPrice) };
        }
        
        if (maxPrice && !isNaN(maxPrice)) {
            if (query.price) {
                query.price.$lte = Number(maxPrice);
            } else {
                query.price = { $lte: Number(maxPrice) };
            }
        }
        
        if (category && category !== "all") {
            query.category = category;
        }
        
        if (country && country !== "all") {
            query.country = country;
        }

        // Fetch all listings based on query
        const allListing = await Listing.find(query).populate('owner');
        
        // For category/country filter dropdown, get unique countries
        const allCountries = await Listing.distinct('country');
        
        // Get min and max prices for price filter range
        const priceStats = await Listing.aggregate([
            { $group: { 
                _id: null, 
                minPrice: { $min: "$price" }, 
                maxPrice: { $max: "$price" } 
            }}
        ]);
        
        const priceRange = priceStats.length > 0 ? {
            min: priceStats[0].minPrice,
            max: priceStats[0].maxPrice
        } : { min: 0, max: 10000 };
        
        // Render the listings page with all data and filter selections
        res.render("listings/index.ejs", {
            allListing,
            allCountries,
            priceRange,
            filters: {
                minPrice: minPrice || '',
                maxPrice: maxPrice || '',
                category: category || 'all',
                country: country || 'all'
            },
            currUser: req.user || null
        });
    } catch (err) {
        console.error("Error fetching listings:", err);
        req.flash('error', 'Error loading listings');
        res.redirect('/');
    }
};

/*  
 * Render the form for creating a new listing
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
module.exports.renderNewForm=(req, res) => {
    console.log(req.user);
    res.render("listings/new.ejs", {
        currUser: req.user || null
    });
}

/*  
 * Display details of a specific listing
 * Includes listing information, owner details, and reviews
 * 
 * @param {Object} req - Express request object with listing ID param
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
module.exports.showListing = async (req, res, next) => {
    try {
        let {id} = req.params;
        
        // Validate ID format first
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            throw new ExpressError(400, 'Invalid listing ID format');
        }

        // Fetch listing with populated reviews and owner information
        const listing = await Listing.findById(id)
            .populate({
                path: 'reviews',
                select: 'rating comment',
                populate: {
                    path: 'author',
                    select: 'username'
                }
            })
            .populate('owner', 'username');
        
        // Check if listing exists
        if (!listing) {
            req.flash('error', 'The requested listing does not exist!');
            return res.redirect('/listings');
        }

        // Ensure required fields exist (data safety)
        if (!listing.title) listing.title = 'Untitled Listing';
        if (!listing.price) listing.price = 0;
        if (!listing.location) listing.location = 'Location not specified';
        if (!listing.country) listing.country = 'Country not specified';
        if (!listing.description) listing.description = 'No description available';
        
        // Handle missing owner data
        if (!listing.owner) {
            listing.owner = { username: 'Unknown Host' };
        }

        // Process reviews to ensure consistent structure
        if (listing.reviews) {
            listing.reviews = listing.reviews.map(review => {
                if (!review.author) {
                    review.author = { username: 'Anonymous' };
                }
                if (!review.rating) review.rating = 0;
                if (!review.comment) review.comment = 'No comment provided';
                return review;
            });
        }

        // Render the listing details page
        res.render("listings/show.ejs", {
            listing,
            currUser: req.user || null
        });
    } catch (err) {
        console.error('Error in showListing:', err);
        req.flash('error', 'An error occurred while loading the listing');
        res.redirect('/listings');
    }
};

/*  
 * Create a new listing
 * Handles form submission and image upload
 * 
 * @param {Object} req - Express request object with listing data
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
module.exports.createListing=(async(req, res,next) => {
    try {
        // Validate input data using schema
        let result=listingSchema.validate(req.body);
        if(result.error) {
            throw new ExpressError(400, result.error);
        }

        // Ensure image is uploaded
        if(!req.file) {
            throw new ExpressError(400, 'Image is required');
        }

        // Create and save the new listing
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
        
        await newListing.save();
        req.flash('success', 'New Listing Created!');
        res.redirect('/listings');
    } catch (err) {
        next(err);
    }
});

/*  
 * Render the form for editing an existing listing
 * 
 * @param {Object} req - Express request object with listing ID param
 * @param {Object} res - Express response object
 */
module.exports.renderEditForm=(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing) {
        req.flash('error', 'Listing You Requested For Does Not Exist!');
        res.redirect('/listings');
    }
    res.render('listings/edit.ejs',{
        listing,
        currUser: req.user || null
    });
})

/*  
 * Update an existing listing
 * Handles form submission and optional image update
 * 
 * @param {Object} req - Express request object with listing ID param and updated data
 * @param {Object} res - Express response object
 */
module.exports.updateListing=(async(req,res)=>{
    let {id}=req.params;
    // Update listing details from form
    let updatedList = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    console.log('Updated Successfully',updatedList);

    // Handle image update if a new file was uploaded
    if(typeof req.file!=='undefined')
    {
        let url=req.file.path;
        let filename=req.file.filename;
        updatedList.image={url,filename};
        await updatedList.save();
    }

    req.flash('success','Listing Is Updated Successfully!');
    res.redirect(`/listings/${id}`);
})

/*  
 * Delete a listing
 * Removes the listing and all associated data
 * 
 * @param {Object} req - Express request object with listing ID param
 * @param {Object} res - Express response object
 */
module.exports.destroyListing=(async(req,res)=>{
    let {id}=req.params;
    let DeletedList=await Listing.findByIdAndDelete(id);
    console.log('Deleted Successfully',DeletedList);
    req.flash('success','Listing Is Deleted Successfully!');
    res.redirect('/listings');
})

/*  
 * Search for listings based on various criteria
 * Supports searching by location, price range, category, and country
 * 
 * @param {Object} req - Express request object with search query parameters
 * @param {Object} res - Express response object
 */
module.exports.searchListings = async (req, res) => {
    try {
        // Get search query and ensure it's a string
        const searchQuery = (req.query.q || req.query.location || '').toString();
        
        // Get default values for filters
        const defaultPriceRange = { min: 0, max: 10000 };
        let allCountries = [];
        let priceRange = defaultPriceRange;

        try {
            // Get all countries for filter dropdown
            allCountries = await Listing.distinct('country');
            
            // Get price range for filter
            const priceStats = await Listing.aggregate([
                { 
                    $group: { 
                        _id: null, 
                        minPrice: { $min: "$price" }, 
                        maxPrice: { $max: "$price" } 
                    }
                }
            ]);
            
            if (priceStats && priceStats.length > 0) {
                priceRange = {
                    min: priceStats[0].minPrice,
                    max: priceStats[0].maxPrice
                };
            }
        } catch (err) {
            console.error("Error fetching filter data:", err);
            // Continue with default values if there's an error
        }

        // Handle empty search
        if (!searchQuery || searchQuery.trim() === '') {
            return res.render("listings/search.ejs", {
                searchResults: [],
                searchQuery: '',
                searchParams: {
                    minPrice: '',
                    maxPrice: '',
                    country: 'all'
                },
                allCountries,
                priceRange
            });
        }

        // Build search query
        let query = {
            $or: [
                { location: { $regex: searchQuery, $options: 'i' } },
                { country: { $regex: searchQuery, $options: 'i' } },
                { title: { $regex: searchQuery, $options: 'i' } }
            ]
        };

        // Safely add price filters if present
        const minPrice = parseFloat(req.query.minPrice);
        const maxPrice = parseFloat(req.query.maxPrice);

        if (!isNaN(minPrice)) {
            query.price = { $gte: minPrice };
        }
        if (!isNaN(maxPrice)) {
            if (query.price) {
                query.price.$lte = maxPrice;
            } else {
                query.price = { $lte: maxPrice };
            }
        }

        // Safely add country filter if present
        if (req.query.country && req.query.country !== 'all') {
            query.country = req.query.country;
        }

        // Fetch filtered results
        const searchResults = await Listing.find(query)
            .populate({
                path: 'reviews',
                select: 'rating'
            })
            .populate('owner', 'username')
            .limit(50); // Limit results to prevent overload

        // Render search results
        res.render("listings/search.ejs", {
            searchResults,
            searchQuery,
            searchParams: {
                minPrice: !isNaN(minPrice) ? minPrice : '',
                maxPrice: !isNaN(maxPrice) ? maxPrice : '',
                country: req.query.country || 'all'
            },
            allCountries,
            priceRange
        });
    } catch (err) {
        console.error("Search error:", err);
        req.flash('error', 'An error occurred while searching. Please try again.');
        res.redirect('/listings');
    }
};

/*
 * Display all listings by a specific owner
 * 
 * @param {Object} req - Express request object with owner ID param
 * @param {Object} res - Express response object
 */
module.exports.showOwnerListings = async(req, res) => {
    try {
        const { ownerId } = req.params;
        
        // Find all listings by the specified owner
        const ownerListings = await Listing.find({ owner: ownerId })
            .populate('owner', 'username');
        
        if (ownerListings.length === 0) {
            req.flash('info', 'This user has no listings yet');
            return res.redirect('/listings');
        }
        
        // Get owner information
        const ownerName = ownerListings[0].owner.username;
        
        // Render the owner listings page
        res.render('listings/owner.ejs', {
            ownerListings,
            ownerName,
            currUser: req.user || null
        });
    } catch (err) {
        console.error("Error fetching owner listings:", err);
        req.flash('error', 'Could not load listings for this owner');
        res.redirect('/listings');
    }
};

/*
 * Display all listings owned by a specific user
 * 
 * @param {Object} req - Express request object with owner ID param
 * @param {Object} res - Express response object
 */
module.exports.ownerListings = async (req, res) => {
    try {
        const { id } = req.params;
        const ownerListings = await Listing.find({ owner: id }).populate('owner');
        
        if (!ownerListings || ownerListings.length === 0) {
            req.flash('info', 'This user has no listings yet');
            return res.redirect('/listings');
        }
        
        res.render('listings/owner', { 
            ownerListings, 
            owner: ownerListings[0].owner,
            currUser: req.user || null
        });
    } catch (err) {
        console.error("Error fetching owner listings:", err);
        req.flash('error', 'Error loading owner listings');
        res.redirect('/listings');
    }
};