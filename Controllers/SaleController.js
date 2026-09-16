const saleService = require("../Services/saleService");

exports.createSale = async (req, res) => {
    try {
        const { customer, items, discount, paymentMethod } = req.body;

        const sale = await saleService.createSale({
            customer,
            salesperson: req.user._id,
            items,
            discount,
            paymentMethod
        });

        res.status(201).json({
            success: true,
            data: sale,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Something went wrong"
        });
    }
}