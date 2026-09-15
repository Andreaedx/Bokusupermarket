const Product = require("../Models/product");
const upload = require("../Middleware/upload");
const sendEmail = require("../Middleware/emailSender");

//create Product
exports.createProduct = async (req, res) => {

    try{

        if(!req.body || Object.keys(req.body).length === 0){
            return res.status(400).json({ message: "Form data fields are missing from the request body"})
        }

        const { name, size, description, price, quantity, color} = req.body;

        if(!req.body.name || !req.body.size || !req.body.description || !req.body.price || !req.body.quantity){
            return res.status(400).json({ message: "Please provide all required fields" });
        }
        
        //check if file exist
        if(!req.file){
            return res.status(400).json({ message: "Please upload an image" });
        }

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

        const allowedFields = [
            'name',
            'size',
            'description',
            'price',
            'quantity',
            'color'
        ];

        const updateData = {};

        allowedFields.forEach((field) => {
            if(req.body[field] !== undefined){
                updateDate[field] = req.body[field];
            }
        });

        if(Object.keys(updateData).length === 0){
            return res.status(400).json({ 
                message: 'No fields provided for update'
            });
        }

        const product = await Product.findByIdAndUpdate(
            id, 
            { 
                name, 
                size, 
                description, 
                price, 
                quantity, 
                color 
            }, 
            { 
                new: true,
                runValidator: true
            }
        );

        if (!product){
            return res.status(404).json({ 
                message: "Product not found" 
            });
        }

        res.status(200).json({ 
            message: "Product updated successfully", 
            product 
        });
    }catch (error) {
        res.status(500).json({ 
            message: "Error update not successful", 
            error: error.message 
        });
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