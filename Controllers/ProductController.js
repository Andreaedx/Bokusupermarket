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
        res.status(500).json({ message: "Error creating ptoduct", error: error.message });
    }
};

//Update product
exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params; //where id is the product to be updated
        const { name, size, description, price, quantity, color } = req.body;

        const product = await Product.findByIdAndUpdate(id, { name, size, description, price, quantity, color });
        if (!product){
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "Product updated successfully", product });

    }catch (error) {
        res.status(500).json({ message: "Error updated successfully", error: error.message });

    }
}