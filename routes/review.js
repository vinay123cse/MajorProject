const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");


const {validateReview, isReviewAuthor} = require("../middleware.js");
const {isLoggedIn} = require("../middleware.js");
const reviewController = require("../controllers/review.js");





router.post("/", 
    isLoggedIn, 
    validateReview,
    wrapAsync(reviewController.createReview)
);

router.delete("/:reviewId", 
    isLoggedIn, 
    isReviewAuthor,
    wrapAsync(reviewController.deleteReview)
);

module.exports = router;
