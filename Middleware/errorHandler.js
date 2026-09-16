const mongoose = require("mongoose");

const errorHandler = (err, req, res, next) => {
    console.err(err);

    //mongoose invalid ObjectId
    if(err instanceof mongoose.Error.CastError){
        return res.status(400).json({ success: false, message: `Invalid ${err.path}` });
    }

    //mongoose validation error
    if(err instanceof mongoose.Error.ValidationError){
        const messages = Object.values(err.errors).map(
            (error) => error.message
        );

        return res.status(400).json({ success: false, message: "Validation failed", error: err.messages });
    }

    //Custom errors
    if(err.statusCode){
        return res.status(err.statusCode).json({ success: false, message: err.message });
    }
    
    //Unknown/unexpected errors
    return res.status(500).json({ success: false, message: "Something went wrong" });

};

module.exports = errorHandler;