const express = require("express");
const dotenv = require("dotenv").config();

const connectDB = require("./Config/databaseConfig");
connectDB();

const app = express();
app.use(express.json());// middleware to parse json request bodies


const productRoute = require("./Routes/ProductRoute");
app.use("/products", productRoute);


app.listen(process.env.PORT, () => {
    console.log(`server is running on port ${process.env.PORT}`);
});