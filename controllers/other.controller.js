const catchAsync = require("../utils/catchAsync.util");
const Other = require("../models/Others.model");
const AppError = require("../utils/appError.util");
const { SITE_PROPERTIES } = require("../utils/keys");


exports.createDocument = catchAsync(async (req,res,next)=>{
    console.log(req.body)
    const document = await Other.create(req.body);

    if(!document) return next(new AppError('Failed To Create Document',500))

    res.status(200).json({
        status: 'success',
        document
    })
})

exports.getAllDocument = catchAsync(async (req,res,next)=>{
    const documents = await Other.find();

    if(!documents) return next(new AppError('Failed To Get Documents',500))

    res.status(200).json({
        status: 'success',
        documents
    })
});

exports.updateDocument = catchAsync(async (req,res,next)=>{
    const document = await Other.findByIdAndUpdate(req.params.id,req.body,{new: true});

    if(!document) return next(new AppError('Failed To Update Document',500))

    res.status(200).json({
        status: 'success',
        document
    })
});

exports.updateSiteProperties = catchAsync(async (req,res,next)=>{
    const siteProperties = await Other.findOneAndUpdate({key: SITE_PROPERTIES},req.body);

    res.status(200).json({
        status: 'success',
        siteProperties
    });
})

exports.getSiteProperties = catchAsync(async (req,res,next)=>{
    const siteProperties = await Other.findOne({key: SITE_PROPERTIES});
    console.log({SITE_PROPERTIES})

    if(!siteProperties)return next(new AppError('No Properties Found',404));

    res.status(200).json({
        status: 'success',
        siteProperties
    });
})