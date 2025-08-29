const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner,validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});


router.route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn,
        
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(listingController.createListing)
    )
    

// new route
router.get("/new",isLoggedIn, listingController.renderNewForm);

router.route("/:id")
    .get(wrapAsync(listingController.showListing)) //show route
    .put(
        isLoggedIn,
        isOwner,
        upload.single('listing[image]'),          //update route
        validateListing,
        wrapAsync(listingController.updateListing)
    )
    .delete(
      isLoggedIn,  // delete route
      isOwner, 
      wrapAsync(listingController.deleteListing)
    )


//index route
//router.get("/", wrapAsync(listingController.index));


//show route
// router.get("/:id", 
//     wrapAsync(listingController.showListing)
// );

// create route
// router.post("/",
//     isLoggedIn,
//     validateListing,
//     wrapAsync(listingController.createListing)
// );

// edit route
router.get("/:id/edit",
    isLoggedIn, 
    isOwner,
    wrapAsync(listingController.renderEditForm)
);

// update route
// router.put("/:id",
//     isLoggedIn,
//     isOwner,
//     validateListing,
//     wrapAsync(listingController.updateListing)
// )

// delete route
// router.delete("/:id",
//     isLoggedIn, 
//     isOwner, 
//     wrapAsync(listingController.deleteListing)
// );
  
module.exports = router;