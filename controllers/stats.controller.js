const Order = require("../models/Orders.model");
const Product = require("../models/Product.model");
const AppError = require("../utils/appError.util");
const catchAsync = require("../utils/catchAsync.util");

exports.newOrders = catchAsync(async (req,res,next)=>{
    const stats = await Order.aggregate([
        {
            $match: {
                deliveryStatus: 'pending',
                orderedAt: {
                    $gte: new Date('2020-09-01'),
                    $lte: new Date()
                }
            }
        },
        {
            $group: {
                _id: 'null',
                newOrders: {
                    $sum: '$totalProduct'
                }
            }
        }
    ]);

    if(!stats[0].newOrders)return next(new AppError('Failed To get The Stats',404))



    res.status(200).json({
        status: 'success',
        newOrders: stats[0].newOrders
    })

});

exports.getMainStats = catchAsync(async (req,res,next)=>{
    const incomeStat = await Order.aggregate([
        {
            $match: {
                paymentStatus: 'paid',
                orderedAt: {
                    $gte: new Date('2020-09-01'),
                    $lte: new Date()
                }
            }
        },
        {
            $group: {
                _id: 'null',
                totalIncome: {
                    $sum: '$totalPrice'
                }
            }
        }
    ]);

    const orderStat = await Order.aggregate([
        {
            $match: {
                deliveryStatus: 'pending',
                orderedAt: {
                    $gte: new Date('2020-09-01'),
                    $lte: new Date()
                }
            }
        },
        {
            $group: {
                _id: 'null',
                newOrders: {
                    $sum: '$totalProduct'
                }
            }
        }
    ]);

    // const newUserStat = await Order



    res.status(200).json({
        status: 'success',
        stats: {
            totalIncome: incomeStat[0].totalIncome,
            newOrders: orderStat[0].newOrders
        }
    })

});

exports.summary = catchAsync(async(req,res,next)=>{
    const sales = await Order.aggregate([
        {
            $match: {
                paymentStatus: 'paid',
                orderedAt: {
                    $gte: new Date('2020-09-01'),
                    $lte: new Date()
                }
            }
        },
        {
            $group: {
                _id: {
                    $dayOfMonth: '$orderedAt'
                },
                sale: {$sum: '$totalProduct'}
            }
        },
        {
            $sort: {
                _id: 1
            }
        }
    ]);

    const cost = await Product.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: new Date('2020-09-01'),
                    $lte: new Date()
                }
            }
        },
        {
            $group: {
                _id: {
                    $dayOfMonth: '$orderedAt'
                },
                cost: { $sum: '$basePrice' },
                quantity: { $sum : '$quantity' }
            }
        },
        {
            $project: {
                totalCost: { $multiply: ['$cost','$quantity'] }
            }
        },
        {
            $sort: {
                _id: 1
            }
        }
    ]) 


    res.status(200).json({
        status: 'success',
        sales,
        cost
    })
})