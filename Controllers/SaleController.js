const Sale = require("../Models/Order");
const User = require("../Models/User");
const Product = require("../Models/product");

exports.createSale = async (req, res) => {
    try {
        const customer = await User.findById({ id: id });
        if(!customer){
            return res.status(400).json({ message: "Customer not found" });
        }

        const product = await Product.findById({ id: id });
        if(!product){
            return res.status(400).json({ message: "Product not found" });
        }

        const sale = new Order(
            {
                customer,
                salesperson,
                items,
                subtotal,
                discount,
                totalAmount,
                paymentMethod,
                paymentStatus
            }
        )

    } catch (error) {

    }
}