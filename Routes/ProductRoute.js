const express = require("express");
const router = express.Router();

//import product controller
const  productController = require("../Controllers/ProductController");


//define the routes for product
router.post("/createproduct", productController.createProduct);
router.put("/updateproduct/:id", productController.updateProductbyid);
router.get("/getproduct/:id", productController.getproductbyid);
router.get("/getallproducts", productController.getallproducts)
router.delete("/delete/:id", productController.deleteproductbyid);

//export the router to be used in other files
module.exports = router;