const Product = require("../models/Product.model");
const catchAsync = require("../utils/catchAsync.util");
const ApiFeatures = require("../utils/apiFeatures");
const uploadImage = require("../utils/upload");
const filter = require("../utils/filterObj.util");

const [s, c] = [[100, 125], [280, 350]];





exports.createProduct = catchAsync(async function (req, res, next) {

    const pd = { ...req.body };

    const small = await Promise.all(pd.image.map(async img => (await uploadImage(img, { width: 100 })).secure_url))
    const card = await Promise.all(pd.image.map(async img => (await uploadImage(img, { width: 280 })).secure_url))
    const original = await Promise.all(pd.image.map(async img => (await uploadImage(img)).secure_url))


    pd.image = { small, card, original }
    const filterBy = ['name', 'price', 'currentPrice', 'basePrice', 'brand', 'catagory', 'image', 'description', 'productCode', 'productType', 'tags', 'quantity', 'nodel', 'size', 'color', 'variant']

    const filteredProduct = filter(pd, ...filterBy)

    const newProduct = await Product.create(filteredProduct)

    res.status(200).json({
        status: 'success',
        product: newProduct
    });
});

exports.getProducts = catchAsync(async function (req, res, next) {
    const features = new ApiFeatures(Product.find(), req.query).filter().sort().paginate();
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

exports.updateProduct = catchAsync(async function (req, res, next) {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })

    res.status(200).json({
        status: 'success',
        product: updatedProduct
    })
});