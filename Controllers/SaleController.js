const saleService = require("../Services/saleService");

exports.createSale = async (req, res, next) => {
    try {
        const { customer,items, discount, paymentMethod } = req.body;

        const userId = req.user.id;

        const sale = await saleService.createSale({
            customer,
            salesperson: userId,
            items,
            discount,
            paymentMethod
        });

        res.status(201).json({
            success: true,
            data: sale,
        });
    } catch (error) {
        next(error);
        // console.error(error);
        // res.status(500).json({
        //     message: "Something went wrong"
        // });
    }
}