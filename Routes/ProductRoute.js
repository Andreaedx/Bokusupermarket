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


router.get('/available', authenticate, authorize("customer"), productController.getAvailaleProducts);

//define the routes for Internal product
router.post('/createproduct', authenticate, authorize("superadmin", "storekeeper"), upload.single("image"), productController.createProduct);
router.put("/updateproduct/:id", authenticate, authorize("storekeeper"), productController.updateProductbyid);
router.get("/getproduct/:id", authenticate, authorize("salesperson"), productController.getproductbyid);
router.get("/getallproducts", authenticate, authorize("superadmin", "storekeeper", "salesperson"), productController.getallproducts);
router.delete("/delete/:id", authenticate, authorize("storekeeper"), productController.deleteproductbyid);

//export the router to be used in other files
module.exports = router;