const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product Must have a name']
    },
    price: {
        type: Number,
        required: [true, 'Product must have a Price']
    },
    currentPrice: Number,
    productCode: {
        type: String,
        unique: true,
        required: [true, 'Please give product a code']
    },
    productType: String,
    catagory: [String],
    tags: [String],
    quantity: {
        type: Number,
        required: [true, 'How many product do you have?']
    },
    brand: String,
    variantCode: String,
    sold: Number,
    basePrice: Number,
    size: [{
        type: String,
        enum: ['XS', 'S', 'M', 'L', 'XL']
    }],
    color: [{
        value: String,
        label: String
    }],
    image: {
        small: [mongoose.Schema.Types.Mixed],
        card: [mongoose.Schema.Types.Mixed],
        original: [mongoose.Schema.Types.Mixed]
    },
    totalStar: Number,
    avgStar: Number,
    reviews: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        comment: String,
        star: Number
    }],
    title: String,
    variant: Boolean,
    description: String
});

productSchema.index({
    'name': 'text',
    'productCode':'text',
    'brand': 'text',
    'title': 'text',
    'catagory': 'text',
    'tags': 'text',
    'productType': 'text',
    'variantCode': 'text'
});


const Product = mongoose.model('Product',productSchema);

module.exports = Product;