const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.createReview = async (req, res, next) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(
        {
            comment: req.body.review.comment,
            rating: parseInt(req.body.review.rating, 10)
        }
    );
    newReview.author = req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);
        
    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Created");
    console.log("new review saved");
    res.redirect(`/listings/${listing.id}`);
}

module.exports.deleteReview = async (req, res) => {
    let {id, reviewId} = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);  
}