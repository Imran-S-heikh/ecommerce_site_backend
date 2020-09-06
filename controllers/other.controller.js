const catchAsync = require("../utils/catchAsync.util");
const Other = require("../models/Others.model");
const AppError = require("../utils/appError.util");


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