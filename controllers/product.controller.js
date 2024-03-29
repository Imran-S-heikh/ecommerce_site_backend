const Product = require("../models/Product.model");
const catchAsync = require("../utils/catchAsync.util");
const ApiFeatures = require("../utils/apiFeatures");
const uploadImage = require("../utils/upload");
const filter = require("../utils/filterObj.util");
const mergeObject = require("../utils/mergeObject");
const AppError = require("../utils/appError.util");
const Order = require("../models/Orders.model");
const isValidCoupon = require("../utils/isValidCoupon");
const Other = require("../models/Others.model");
const {paypalCheckout} = require("../utils/paypalCheckout");
const stripe = require('stripe')(process.env.STRIPE_SECRET)



exports.createProduct = catchAsync(async function (req, res, next) {

    const pd = { ...req.body };

    const small = await Promise.all(pd.image.map(async img => (await uploadImage(img, { width: 100 })).secure_url))
    const card = await Promise.all(pd.image.map(async img => (await uploadImage(img, { width: 280 })).secure_url))
    const original = await Promise.all(pd.image.map(async img => (await uploadImage(img)).secure_url))


    pd.image = { small, card, original }
    const filterBy = ['name', 'price', 'currentPrice', 'basePrice', 'brand', 'catagory', 'image', 'description', 'productCode', 'productType', 'tags', 'quantity', 'nodel', 'size', 'color', 'variant', 'title']

    const filteredProduct = filter(pd, ...filterBy)

    const newProduct = await Product.create({...filteredProduct,createdAt: new Date()})

    res.status(200).json({
        status: 'success',
        product: newProduct
    });
});

exports.getProducts = catchAsync(async function (req, res, next) {
    const features = new ApiFeatures(Product.find(), req.query).filter().sort().paginate().search();
    const products = await features.query;
    const count = await Product.countDocuments();

    res.status(200).json({
        status: 'success',
        total: count,
        length: products.length,
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
    let imageObject = req.body.imageObject;
    const newImage = req.body.image.filter((img) => !img.includes('https://'))

    if (newImage.length !== 0) {
        const small = await Promise.all(newImage.map(async img => (await uploadImage(img, { width: 100 })).secure_url))
        const card = await Promise.all(newImage.map(async img => (await uploadImage(img, { width: 280 })).secure_url))
        const original = await Promise.all(newImage.map(async img => (await uploadImage(img)).secure_url))


        imageObject = mergeObject(imageObject, { small, card, original })

    }

    req.body.image = imageObject;

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })

    res.status(200).json({
        status: 'success',
        product: updatedProduct
    })
});

exports.checkout = catchAsync(async (req, res, next) => {
    const { paymentMethod, address, country, state } = req.body;
    const products = await Product.find().where('_id').in(req.body.products.map(item => item.id)).exec();
    

    if (!products) return next(new AppError('No Products Found', 404));

    const orderProducts = [];
    const line_items = [];
    let totalProduct = 0
    let totalProductPrice = 0;
    let coupon = null;
    let discount = 0;

    products.map(product => {
        const count = req.body.products.filter(item => item.id == product._id)[0].quantity || 1;

        const subTotal = product.price * count;
        totalProduct = totalProduct + count;
        totalProductPrice = subTotal + totalProductPrice;
        line_items.push({name: product.name,description: product.description,images: [product.image.small[0]],amount: product.price * 100,currency: 'usd',quantity: count})
        orderProducts.push({ subTotal, quantity: count, product: product._id, price: product.price })
    });

    if(req.body.couponCode){
        const doc = await Other.findOne({
            coupons: {
                $elemMatch: {
                    expiresIn: {$gte: (new Date()).toISOString()},
                    code: req.body.couponCode
                }
            }
        },{'coupons.$': 1});
        if(doc && isValidCoupon(doc._doc.coupons[0],products)){
            discount = doc._doc.coupons[0].discount
            coupon = doc._doc.coupons[0];
        }
        console.log({isTrue: isValidCoupon(doc._doc.coupons[0],products),discount})
    }

    const orderData = {
        totalProduct,
        totalProductPrice,
        totalPrice: totalProductPrice - discount,
        products: orderProducts,
        orderBy: req.user._id,
        orderedAt: new Date(),
        paymentMethod,
        address,
        country,
        state
    }

    if(coupon){
        orderData.coupon = coupon
    }

    const order = await Order.create(orderData);

    if(order){
        try {
            (order.products.map(item=>{
               Product.findByIdAndUpdate(item.product,{$inc :{sold: item.quantity,quantity: -item.quantity}}).exec();
            }))
        } catch (error) {
            console.log(error)
        }
    }
    if(order.paymentMethod === 'stripe'){
        const paymentIntent = await stripe.paymentIntents.create({
            amount: orderData.totalPrice * 100,
            currency: 'usd',
            receipt_email: req.user.email,
            metadata: {integration_check: 'accept_a_payment'}
        });
    
        if(!paymentIntent)return next(new AppError('Failed To get Intent',500))
    
        res.status(200).json({
            status: 'success',
            clientSecret: paymentIntent.client_secret,
            orderId: order._id
        })
    }else if(order.paymentMethod === 'paypal'){
        const paypalOrderId = await paypalCheckout(orderData.totalPrice);
        res.status(200).json({
            status: 'success',
            orderId: order._id,
            paypalOrderId
        })
    }else{
        return next(new AppError('Payment Method not recognised',400))
    }
});