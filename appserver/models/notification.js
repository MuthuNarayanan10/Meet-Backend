const mongoose = require('mongoose');
var Schema = mongoose.Schema;


const NotificationSchema = mongoose.Schema({
    meetingdate :{
        type : String,
        required : true
    },
    meetingid :{
        type : String,
        required : true
    },
    notificationstatus :{
        type : String,
        required : true
    },
    notificationtime :{
        type : String,
        required : true
    },    
    
    
});

const Notification = module.exports = mongoose.model('Notification',NotificationSchema)
