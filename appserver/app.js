var express = require('express');
var mongoose = require('mongoose');
var bodyparser = require('body-parser');
var cors = require('cors');
var path = require('path');
var nodemailer = require('nodemailer')
const route = require('./routes/route');
const Meeting = require('./models/meeting');
const http = require('http')
const uri = require('./config/key').mongoURI
var app = express();
const server = http.createServer(app)
const socket = require('socket.io')
const io = socket(server)

io.on('connection', function (socket) {
    console.log('Nw connection')
    require('./socket/socket')(socket);
});

const port = 3000;

//Db connection
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err, database) => {
    if (err) return console.error(err);
    server.listen(port, () => {
        console.log(`Running on Port ${port} \nDB connected to ${uri}`)
    })
});



//body parsert
app.use(cors());
app.use(bodyparser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', route);

/**************************************************** */
/***sending notification automatically to the users */
/************************************************** */

var cron = require('node-cron');

var task = cron.schedule('* * * * *', () => {
    console.log('will execute every minute until stopped');
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = dd + '/' + mm + '/' + yyyy;
    console.log('today:' + today);

    Meeting.find(function (err, Meetings) {
        Meetings.forEach(c => {
            console.log(c.date);
            if (today == c.date) {
                console.log('today we have meeting...');
                console.log('sent notifications to:' + c.users);
                console.log('time:' + c.time);

                var userarr = c.users.split(',');
                var meetingtime = c.time.split(':');
                var now = new Date();
                var hour = now.getHours();
                var min = now.getMinutes();
                var meridiem = hour >= 12 ? "PM" : "AM";

                var sendmail = 'no';

                console.log('meeting hour:' + meetingtime[0]);
                console.log('meeting minute:' + meetingtime[1]);
                console.log('current hour:' + hour % 12);
                hour = hour % 12;
                console.log('current minte:' + min);
                console.log('meeting meridian=' + meetingtime[2]);
                console.log('meridiem:' + meridiem);

                if (meetingtime[2] == 'AM' && meridiem == 'AM') {
                    if (hour > Number(meetingtime[0])) {
                        sendmail = 'no';

                    }
                    else if (hour == Number(meetingtime[1])) {
                        if (min > Number(meetingtime[1])) {
                            sendmail = 'no';
                        }
                        else {
                            sendmail = 'yes';
                        }
                    }
                    else {

                        sendmail = 'yes';
                    }
                }
                else if (meetingtime[2] == 'PM' && meridiem == 'PM') {
                    console.log('pm')
                    if (hour > Number(meetingtime[0])) {
                        console.log('hour>meetingingtime');
                        sendmail = 'no';

                    }
                    else if (hour == Number(meetingtime[1])) {
                        if (min > Number(meetingtime[1])) {
                            sendmail = 'no';
                        }
                        else {
                            sendmail = 'yes';
                        }
                    }
                    else {

                        sendmail = 'yes';
                    }
                }
                else if (meridiem == 'AM' && meetingtime[2] == 'PM') {
                    sendmail = 'yes';
                }
                //console.log(userarr);

                if (sendmail == 'yes') {
                    console.log('meeting yet to start');


                    var transporter = nodemailer.createTransport({
                        service: 'gmail.com',

                        secure: false,
                        auth: {
                            user: 'amrmuthu10@gmail.com',
                            pass: 'muthumoni1120'
                        }
                    });

                    for (let i in userarr) {
                        console.log('\n' + userarr[i]);

                        var message = 'You Have meeting today date:' + c.date + ' <br> time:' + c.time + '<br> purpose:' + c.purpose + '<br> venue:' + c.venue;

                        var mailOptions = {
                            from: 'amrmuthu10@gmail.com',
                            to: userarr[i],
                            subject: 'Meeting Reminder..',
                            text: message
                        };

                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                console.log(error);
                            } else {
                                console.log('Email sent: ' + info.response);
                            }
                        });
                    }

                }
                else {
                    console.log('meeting started');
                }


            }

        });
        //response.json(users);
    });

});

task.start()
