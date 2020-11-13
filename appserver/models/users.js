const mongoose = require('mongoose');
var Schema = mongoose.Schema;


const UserSchema = mongoose.Schema({
    firstname :{
        type : String,
        required : true
    },
    lastname :{
        type : String,
        required : true
    },
    email :{
        type : String,
        unique: true,
        lowercase:true,
        required : true
    },
    password : {
        type: String,
        required : true
    },
    mobileno : {
        type : Number
    }

    
});

const User = module.exports = mongoose.model('User',UserSchema)