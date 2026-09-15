const express = require("express");
const router = express.Router();


const userController = require("../Controllers/UserController");

//Define the routes
router.post("/createuser", userController.createUser);
router.post("/loginuser", userController.loginuser);

module.exports = router;