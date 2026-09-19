const express = require("express");
const router = express.Router();
const saleController = require("../Controllers/SaleController");
const { authenticate } = require("../Middleware/auth");
const { authorize } = require("../Middleware/roleAuthorization");

router.post("/create", authenticate, authorize("admin", "salesperson"), saleController.createSale);
// router.get("/my-sales", authenticate, authorize("salesperson"), saleController.getMySale);
// router.get("/", authenticate, authorize("superadmin"), saleController.getAllSales);

module.exports = router;




