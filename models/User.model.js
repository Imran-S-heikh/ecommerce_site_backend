const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    role: {
        type: [String],
        default: 'user',
        enum: ['user','admin','moderator']
    },
    email: {
        type: String,
        required: [true,'User must have a Email'],
        unique: true
    },
    password: {
        type: String,
        required: [true,'Please provide a strong Password'],
        minlength: 8,
        select: false
    },
    confirmPassword: {
        type: String,
        required: true,
        validate: {
            validator: function(val){
                return val === this.password
            },
            message: "Password didn't match"
        }
    },
    purchased: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Product'
    }],
    wishlist: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Product'
    }],
    totalTransaction: Number,
    transaction: Number
});

userSchema.pre('save',async function(next){
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password,12);
    this.confirmPassword = undefined;

    next();
});

userSchema.methods.checkPassword = async function(givenPassword,storedPassword){
    return await bcrypt.compare(givenPassword,storedPassword);
}


const User = mongoose.model('User',userSchema);

module.exports = User;