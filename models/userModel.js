const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName:{
        type:String,
        required: true,
        unique: true,
        trim:true
    },
    email:{
        type:String,
        required: true,
        unique: true,
        trim:true
    },
    password:{
        type:String,
        required: true
    },
    role:{
        type:String,
        enum:['admin', 'user'],
        default: 'user'
    }
})


const User = mongoose.model('User', userSchema);

module.exports = User;