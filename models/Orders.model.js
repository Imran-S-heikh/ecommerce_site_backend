const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    totalProduct: Number,
    totalPrice: Number,
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },
            subTotal: Number,
            quantity: Number
        }
    ],
    orderBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    orderedAt: Date,
    deliveryStatus: {
        type: String,
        default: 'pending',
        enum: ['pending','cancelled','complete']
    },
    paymentStatus: {
        type: String,
        default: 'pending',
        enum: ['pending','paid','cancelled']
    },
    paymentMethod: String,
    address: String,
    country: String,
    state: String
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;