const express = require("express");
const dotenv = require("dotenv").config();

const app = express();
app.use(express.json());// middleware to parse json request bodies
// app.use(express.urlencoded({ extended: true }));//middleware to parse multipart/form data

const connectDB = require("./Config/databaseConfig");
connectDB();

const errorHandler = require("./Middleware/errorHandler");
const productRoute = require("./Routes/ProductRoute");
const userRoute = require("./Routes/UserRoute");


app.use("/products", productRoute);//product route foe all request starting with /product
app.use("/user", userRoute);//user route for all request starting with /user


//Error handler MUST come after routes 
app.use("errorHandler");

app.listen(process.env.PORT, () => {
    console.log(`server is running on port ${process.env.PORT}`);
});