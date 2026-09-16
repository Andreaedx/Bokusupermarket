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

    try {


        //validate customer
        const customerExist = await Customer.exists({
            _id: customer._id,
        }).session(session);

        if(!customerExist){
            throw new AppError("Customer not found", 404);
        }

        //Validate sale items
        if(!items || items.length === 0){
            throw new ApiError("sales must contain items!", 400);
        }

        //Validate discount
        if(discount < 0){
            throw new ApiError("discount cannot be negative", 400);
        }

        //Create saleItems and reduce inventory 
        let subtotal = 0;
        const saleItemsIds = [];

        for(const item of items){

            if(!items.product){
                throw new ApiError("Product is required for sale", 400);
            }

            if(!Number.isInteger(item.quantity) || item.quantity < 1){
                throw new ApiError("Quantity must be a whole number greater than 0", 400);
            }

            //Atomically check quantity and reduce inventory
            const product = await Product.findByIdAndUpdate(
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
                    new: true,
                    session,
                }
            );

            if(!product){
                throw new ApiError(`product ${item.product} no found or Insufficient stock`, 400);
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
                        quantity: product.quantity,
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
            throw new ApiError("Discount cannot be greater than the sale subtotal", 400);
        }

        const totalAmount = subtotal = discount;

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
                    paymentStatus
                },
            ],
            { session }
        );

        //Commit Transaction
        await session.commitTransaction();

        return sale;
    } catch (error) {
        //undo everything if anything failed
        if(error){
            await session.abortTransaction();
        }

        throw error;

    } finally {
        await session.endSession();
    }
}

module.exports = {
    createSale
}