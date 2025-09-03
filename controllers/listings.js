const { options } = require("joi");
const Listing = require("../models/listing.js");

module.exports.index = async(req, res) => {
    let query = req.query.q;
    let allListings;
    if(query) {
        allListings = await Listing.find({
            title: {$regex: query, $options: "i"}    //case insensitive search i allow karega
        })
    }else {
        allListings = await Listing.find({});
    }
    
    res.render("listings/index.ejs", {allListings});

     
}

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res, next) => {
    let {id} = req.params;
        
    const listing = await Listing.findById(id)
        .populate({path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("owner");
       // console.log(listing.reviews); 
        // if (!listing) {
        //     throw new ExpressError(404, "Listing not found");
        // }
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
}

module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename; 
    const newListing = new Listing(req.body.listing); // form data ka naya document bana fir uslo save kar diya mongodb me
    
    newListing.owner = req.user._id; // jo user listing create karega uska name show hoga
    newListing.image = {url, filename};
    await newListing.save();
       
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
       
}

module.exports.renderEditForm = async (req, res, next) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", {listing, originalImageUrl});
}  

module.exports.updateListing = async (req, res) => {
    let {id} = req.params;
    
        
    
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});

    // if(typeof req.file !== "undefined") {
    //     let url = req.file.path;
    //     let filename = req.file.filename;

    //     listing.image = {url, filename};
    //     await listing.save();
    // }

    if(req.file && req.file.path && req.file.filename){
        let url = req.file.path;
        let filename = req.file.filename;

        listing.image = {url, filename};
        await listing.save();
    }
    req.flash("success", "Listing Updated");
    res.redirect(`/listings`);
}

module.exports.deleteListing = async (req, res, next) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    console.log(deletedListing);
    res.redirect("/listings");
}