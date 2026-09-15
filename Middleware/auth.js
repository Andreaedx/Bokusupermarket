const jwt = require("jsonwebtoken");

//middleware to verify token
exports.authenticate = (req, res, next) => {
    //get the token from the authorization header
    const token = req.headers.authorization && req.headers.authorization.split(" ")[1];
    if(!token){
        return res.status(401).json({ message: "not authorized, no token"})
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }catch (error) {
        res.status(401).json({ message: "not authorized, token failed"});
    }
};