const mongoose = require("mongoose");

const Sale = require("../Models/Order");
const Product = require("../Models/product");
const SaleItem = require("../Models/SaleItem");
const Customer = require("../Models/User");

const AppError = require("../utils/AppError");

const createSale = async ({
    customer,
    salesperson,
    items,
    discount = 0,
    paymentMethod
}) => {
    const session = await mongoose.startSession();

    session.startTransaction();

    try {


        //validate customer
        const customerExist = await Customer.exists({
            _id: customer,
        }).session(session);

        if(!customerExist){
            throw new AppError(
                "Customer not found", 
                404
            );
        }

        //Validate sale items
        if(!items || items.length === 0){
            throw new AppError(
                "sales must contain items!", 
                400
            );
        }

        //Validate discount
        if(discount < 0){
            throw new AppError(
                "discount cannot be negative", 
                400
            );
        }

        //Create saleItems and reduce inventory 
        let subtotal = 0;
        const saleItemsIds = [];

        for(const item of items){

            if(!item.product){
                throw new AppError(
                    "Product is required for sale", 
                    400
                );
            }

            if(!Number.isInteger(item.quantity) || item.quantity < 1){
                throw new AppError(
                    "Quantity must be a whole number greater than 0", 
                    400
                );
            }

            //Check if product exists
            const productExists = await Product.exists({
                _id: item.product,
            }).session(session);

            if (!productExists) {
                throw new AppError(
                    `Product ${item.product} not found`, 
                    404
                );
            }

            //Atomically check quantity and reduce inventory
            const product = await Product.findOneAndUpdate(
                {
                    _id: item.product,
                    quantity: { $gte: item.quantity },
                },
                {
                    $inc: {
                        quantity: -item.quantity,
                    },
                },
                {
                    returnDocument: "after",
                    session
                }
            );

            if (!product) {
                const currentProduct = await Product.findById(
                    item.product
                ).select("name quantity").session(session);

                throw new AppError(
                    `Insufficient stock for ${currentProduct.name}. Only ${currentProduct.quantity} available.`, 
                    409
                );
            }

            //Update availability
            if(product.quantity === 0){

                product.isAvailable = false;
                await product.save({ session });
            }

            //Calculate this item's subtotal using the current database price
            const itemSubtotal = product.price * item.quantity;

            //Create SaleItem
            const [saleItem] = await SaleItem.create(
                [
                    {
                        product: product._id,
                        quantity: item.quantity,
                        unitPrice: product.price,
                        subtotal: itemSubtotal
                    },
                ],
                { session }
            );

            saleItemsIds.push(saleItem._id);

            //Add item subtotal to sale subtotal
            subtotal += itemSubtotal;
        }

        // final calculation with discount
        if(discount > subtotal){
            throw new AppError(
                "Discount cannot be greater than the sale subtotal", 
                400
            );
        }

        const totalAmount = subtotal - discount;

        // Create sale
        const [sale] = await Sale.create(
            [
                {
                    customer,
                    salesperson,
                    items: saleItemsIds,
                    subtotal,
                    discount,
                    totalAmount,
                    paymentMethod,
                    //Explicitly pending
                    paymentStatus: "pending"
                },
            ],
            { session }
        );

        //Commit Transaction
        await session.commitTransaction();

        return sale;
    } catch (error) {
        //undo everything if anything failed
        if(session.inTransaction()){
            await session.abortTransaction();
        }

        throw error;

    } finally {
        session.endSession();
    }
}

module.exports = {
    createSale
}