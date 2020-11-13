const mongoose = require('mongoose');
var Schema = mongoose.Schema;


const MeetingSchema = mongoose.Schema({
    date :{
        type : String,
        required : true
    },
    time :{
        type : String,
        required : true
    },
    purpose :{
        type : String,
        required : true
    },
    venue :{
        type : String,
        required : true
    },    
    organisedby:{
        type:String, //admin - email
        required:true
    },
    users :{
        type : String,
        required : true
    },
    
});

const Meeting = module.exports = mongoose.model('Meeting',MeetingSchema)