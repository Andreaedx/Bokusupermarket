const Product = require("../Models/product");
const upload = require("../Middleware/upload");
const sendEmail = require("../Middleware/emailSender");

//create a new product
// const createProduct = async (req, res) => {
//     try {
//         const product = new Product(req.body);
//         await product.save();
//         res.status(201).json(product);
//     } catch {
//         res.status(400).status({ message: error.message });
//     }
// };

// module.exports = { createProduct };

//Create a product
exports.createProduct = async (req, res) => {
    try {

        if(!req.body.name || !req.body.size || !req.body.description || !req.body.price || !req.body.quantity){
            res.status(400).json({ massage : "Please provide all require fields" });
        }

        const { name, size, description, price, quantity, color } = req.body;

        const product = new Product({
            name, 
            size, 
            description, 
            price, 
            quantity, 
            color
        });

        await product.save();

        //send email notification to the admin that a new product has been created
        const subject = "New Product Created";
        const text = `A new product has been created:\n\nName: ${name}\nSize: ${size}\nDescription: ${description}\nPrice: ${price}\nQuantity: ${quantity}\nColor: ${color}`;
        await sendEmail(process.env.EMAIL_USER, subject, text);

        res.status(201).json({ message: "Product created sucessfully", product});
    }catch (error) {
        res.status(500).json({ message: "Error creating product", error: error.message });
    }
};

//for example purpose normally you write one createproduct method 
//all you need to do is to integrate you upload code

exports.createProductWithImageUpload = async (req, res) => {

    try{

        if(!req.body || Object.keys(req.body).length === 0){
            return res.status(400).json({ message: "Form data fields are missing from the request body"})
        }

        if(!req.body.name || !req.body.size || !req.body.description || !req.body.price || !req.body.quantity){
            return res.status(400).json({ message: "Please provide all required fields" });
        }
        
        //check if file exist
        if(!req.file){
            return res.status(400).json({ message: "Please upload an image" });
        }
        
        const { name, size, description, price, quantity, color, image } = req.body;

        const product = new Product({
            name,
            size,
            description,
            price,
            quantity,
            color,
            image: req.file.path //saves the image path to database
        });

        await product.save();

        return res.status(201).json({ message: "product create creaated sucessfully with image", product });

    } catch (error) {
        return res.status(500).json({ message: "Error creating product", error: error.message });
    }
}

//Update product
exports.updateProductbyid = async (req, res) => {
    try {
        const { id } = req.params; //where id is the product to be updated
        const { name, size, description, price, quantity, color } = req.body;

        const product = await Product.findByIdAndUpdate(id, { name, size, description, price, quantity, color });

        if (!product){
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "Product updated successfully", product });
    }catch (error) {
        res.status(500).json({ message: "Error update not successful", error: error.message });
    }
}

exports.getproductbyid = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "Requires an id"});
        }

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found"})
        }

        res.status(200).json(product);
    }catch (error) {

        res.status(500).json({ message: "something went wrong"});
    }
}

exports.getallproducts = async (req, res) => {
    try {
        const product = await Product.find({});

        res.status(200).json(product);

    }catch (error) {
        res.status(500).json({ message: "something when wrong", error: error.message});
    }
}

exports.deleteproductbyid = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Requiires an id"});
        }

        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found"});
        }

        res.status(200).json({ message: "deleted sucessfully", product});

    }catch (error) {
        res.status(500).json({ message: "something went wrong", error: error.message });
    }
}