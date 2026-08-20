//create authorization middleware

exports.authorize = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.body.role)){
            return res.status(401).json({ message: "not authorized to acess this role" });
        }
        next();
    };
};