const express = require("express");
const router = express.Router();

//import authentication middleware
const { authenticate } = require("../Middleware/auth");
//import authorization middleware
const { authorize } = require("../Middleware/roleAuthorization");

//import product controller
const  productController = require("../Controllers/ProductController");

//import upload 
const upload = require("../Middleware/upload");


//define the routes for product
// router.post("/createproduct", authenticate, authorize("superadmin"), productController.createProduct);
router.post("/createproduct", productController.createProduct);

router.post("/createproductwithimage", authenticate, upload.single("image"), productController.createProductWithImageUpload);

router.put("/updateproduct/:id", authenticate, authorize("saleperson"), productController.getallproducts);

router.get("/getproduct/:id", productController.getproductbyid);
router.get("/getallproducts", productController.getallproducts);

router.delete("/delete/:id", authenticate, productController.deleteproductbyid);

//export the router to be used in other files
module.exports = router;