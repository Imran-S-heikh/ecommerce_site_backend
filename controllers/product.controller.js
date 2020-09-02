const Product = require("../models/Product.model");
const catchAsync = require("../utils/catchAsync.util");
const ApiFeatures = require("../utils/apiFeatures");

exports.createProduct = catchAsync(async function (req, res, next) {
    const newProduct = await Product.create(req.body)

    res.status(200).json({
        status: 'success',
        product: newProduct
    });
});

exports.getProducts = catchAsync(async function (req, res, next) {
    const features = new ApiFeatures(Product.find(),req.query).filter().sort().paginate();
    const products = await features.query;

    res.status(200).json({
        status: 'success',
        products
    });
});


exports.getSingleProduct = catchAsync(async function (req, res, next) {
    const product = await Product.findById(req.params.id)

    res.status(200).json({
        status: 'success',
        product
    });
});

exports.updateProduct = catchAsync(async function(req,res,next){
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id,req.body,{new: true})

    res.status(200).json({
        status: 'success',
        product: updatedProduct
    })
});