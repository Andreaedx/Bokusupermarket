const Product = require("../Models/product");

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
        const { name, size, description, price, quantity, color} = req.body;

        const product = new Product({
            name, 
            size, 
            description, 
            price, 
            quantity, 
            color 
        });

        await product.save();
        res.status(201).json({ message: "Product created sucessfully", product});

    }catch (error) {

        res.status(500).json({ message: "Error creating product", error: error.message });

    }
};

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