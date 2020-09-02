const catchAsync = require("../utils/catchAsync.util");
const User = require("../models/User.model");
const AppError = require("../utils/appError.util");
const filter = require("../utils/filterObj.util");



exports.getUser = catchAsync(async (req,res,next)=>{
    const user = await User.findById(req.params.id)

    res.status(200).json({
        status: 'success',
        user
    })
});

exports.sendUser = catchAsync(async (req,res,next)=>{

    res.status(200).json({
        status: 'success',
        user: req.user
    });
});

exports.getAllUser = catchAsync(async (req,res,next)=>{
    const users = await User.find();

    res.status(200).json({
        status: 'success',
        users
    })
});

exports.updateUser = catchAsync(async (req,res,next)=>{
    const userData = filter(req.body,'name','password','email');
    const updatedUser = await User.findByIdAndUpdate(req.params.id,userData,{new: true});

    if(!updatedUser)return next(new AppError('User not Found',404));

    res.status(200).json({
        status: 'success',
        user: updatedUser
    })
});

exports.updateAdmin = catchAsync(async (req,res,next)=>{
    const updatedAdmin = await User.findByIdAndUpdate(req.params.id,req.body,{new: true});

    if(!updatedAdmin)return next(new AppError('User not Found',404));

    res.status(200).json({
        status: 'success',
        user: updatedAdmin
    })
});