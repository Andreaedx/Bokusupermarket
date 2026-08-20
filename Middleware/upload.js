const cloudinary = require("../Config/cloudinaryConfig");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "bokkusupermarket",
        allowedFormats: ["jpg", "jpeg", "png"],
        transformation: [{ width: 500, height: 500, crop: "limit" }]
    }
});

const upload = multer({ storage: storage });

module.exports = upload;