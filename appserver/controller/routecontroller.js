const express = require('express');
const router = express.Router();

const User = require('../models/users');
const Meeting = require('../models/meeting');

const { request, response } = require('express');

const getusers = (req,resp,next)=>{
    resp.send('Retreiving the contact list');
};

var nodemailer = require('nodemailer')

const updatemeeting=(request,response,next)=>{
    
    console.log('id :'+request.params.id);
    console.log('users:'+request.body.users);
    console.log('date:'+request.body.date);
    console.log('time:'+request.body.time);
    console.log('purpose'+request.body.purpose);
    console.log('venue:'+request.body.venue);

    var userlist = request.body.users;
    var meetingusers = "";

    for(let i in userlist){
        //console.log('\n'+userss[i]);
        if(meetingusers == "")
        {
            meetingusers = userlist[i];
        }
        else{
            meetingusers = meetingusers+","+userlist[i];
        }
        
    }
    request.body.users = meetingusers;

    Meeting.findOneAndUpdate({_id:request.params.id},{$set : request.body},function(err,result){
        console.log(err);
        if(err)
        {
            console.log(err);
            response.json(err);
        }else{


            //var users = request.body.users;
            var date = request.body.date;
            var time = request.body.time;
            var venue = request.body.venue;
            var purpose = request.body.purpose;

            // var userarr = users.split(',');
            // console.log(userarr);

            
            var transporter = nodemailer.createTransport({
                service: 'gmail.com',
                    auth: {
                        user: 'amrmuthu10@gmail.com',
                        pass: 'muthumoni1120'
                    }
            });

            for(let i in userlist){
                console.log('\n'+userlist[i]);

                var message = 'Updated Meeting Details: meeting date:'+date+' time:'+time+' purpose:'+purpose+' venue:'+venue+' users:'+userlist;

            var mailOptions = {
                from: 'amrmuthu10@gmail.com',
                to: userlist[i],
                subject: 'Meeting Details Updated:',
                text: message
              };
              
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });
            }



            console.log('updated');
            Meeting.find({'_id':request.params.id},function(err,meeting){
                response.json(meeting);
            });
            // response.json(result);
        }
    });

};


const addnewmeeting = (request,response,next)=>{

    var userlist = request.body.users
    var meetingusers = "";

    for(let i in userlist){
        //console.log('\n'+userss[i]);
        if(meetingusers == "")
        {
            meetingusers = userlist[i];
        }
        else{
            meetingusers = meetingusers+","+userlist[i];
        }
        
    }
   // console.log(meetingusers);

    let newmeeting = new Meeting({
        date : request.body.date,
        time : request.body.time,
        purpose : request.body.purpose,
        venue : request.body.venue,
        organisedby : request.body.organisedby,
        users : meetingusers,
        

    });
   // console.log(newmeeting.users);

    // newmeeting.save((err,meeting)=>{
    //     console.log(err);
    //     if(err){
    //                 response.json({msg:'failed to add meeting'});
    //             }
    //             else {
    //                 response.json({msg:'success to add meeting'});
    //             }
    // })

    newmeeting.save((err,meeting)=>{
        console.log(err);
        if(err){
            response.json({msg:'failed to add meeting'+err});
        }
        else {
            
            var users = request.body.users;
            var date = request.body.date;
            var time = request.body.time;
            var venue = request.body.venue;
            var purpose = request.body.purpose;

            // var userarr = users.split(',');
            // console.log(userarr);

            
            var transporter = nodemailer.createTransport({
                service: 'gmail.com',
                    auth: {
                        user: 'amrmuthu10@gmail.com',
                        pass: 'muthumoni1120'
                    }
            });

            for(let i in users){
                console.log('\n'+users[i]);

                var message = 'You Have been added to meeting date:'+date+'time:'+time+'purpose:'+purpose+'venue:'+venue+' users:'+users;

            var mailOptions = {
                from: 'amrmuthu10@gmail.com',
                to: users[i],
                subject: 'new meeting created in meeting app',
                text: message
              };
              
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });
            }
            
            
            response.json({msg:'meeting added successfully'});


        }
    });
    
};

const addnewuser = (request,response,next)=>{
    let newuser = new User({
        firstname : request.body.firstname,
        lastname : request.body.lastname,
        email : request.body.email,
        password : request.body.password,
        mobileno : request.body.mobileno
    });
    console.log('data received');
    newuser.save((err,user)=>{
            if(err){
                console.log(err);
                response.json({msg:'failed to add user'});
            }else{


                var transporter = nodemailer.createTransport({
                    service: 'gmail.com',
                        auth: {
                            user: 'amrmuthu10@gmail.com',
                            pass: 'muthumoni1120'
                        }
                });

                var mailOptions = {
                    from: 'amrmuthu10@gmail.com',
                    to: request.body.email,
                    subject: 'account created in meeting app',
                    text: `Your Account Created in Meeting APP`
                  };
                  
                  transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                      console.log(error);
                    } else {
                      console.log('Email sent: ' + info.response);
                    }
                  });



                console.log('user added');
                response.json({msg:'user added successfully'});
            }
    });

   



};

const getmeeting = (request,response,next)=>{

    var _id =  request.body._id;

    Meeting.find({'_id':_id},function(err,meeting){
        response.json(meeting);
    });

};


const getuser = (request,response,next)=>{

    var email =  request.body.email;

    User.find({'email':email},function(err,user){
        response.json(user);
    });

};

const getallmeetings = (request,response,next)=>{

    Meeting.find(function(err,meetings){
        response.json(meetings);
    })

};

//retreiving users
const getallusers = (request,response,next)=>{
    // response.send('Retreive the user list data');
    User.find(function(err,users){
        response.json(users);
    })
};

const deletemeeting =(request,response,next)=>{
    console.log('delete method called');
   Meeting.remove({_id:request.params.id},function(err,result){
        if(err)
        {
            response.json(err);
        }else{
            response.json(result);
        }
   });
};

const deleteuser = (request,response,next)=>{
    console.log('delete method called');
    User.remove({_id:request.params.id},function(err,result){
        if(err)
        {
            response.json(err);
        }else{
            response.json(result);
        }

    });
};


module.exports = {
    getusers,
    updatemeeting,
    addnewmeeting,
    addnewuser,
    getmeeting,
    getuser,
    deletemeeting,
    getallmeetings,
    getallusers,
    deleteuser
}



