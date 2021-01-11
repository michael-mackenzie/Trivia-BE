const db = require("../models");
const User = db.users;
var nodemailer = require('nodemailer');
const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/mike_db', {useNewUrlParser: true});

var data = [];

User
  .find({})
  .populate('attempts')
  .then(users => {

    var start = new Date();
    var end = new Date();
    start.setHours(0,0,0,0);
    end.setHours(23,59,59,999);

    users.forEach(user => {
      var todaysAttempts = user.attempts.filter(function(att) {
        return att.createdAt.getTime() > start.getTime();
      });

      var todaysScore = todaysAttempts.reduce(function(a, b){
        return a + b["score"]
      }, 0);

      data.push({
        email: user.email,
        nickname: user.nickname,
        todaysScore: todaysScore
      });

    });
    data.sort((a,b) => {
      return b.todaysScore - a.todaysScore;
    })

    data = data.slice(0, 10);
    data = data.map(function(user) {
      return `Email: ${user.email}, Nickname: ${user.nickname}, Score: ${user.todaysScore}`;
    });

    data = data.join("\n");

    var transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: 'mikedavidmackenzie@gmail.com',
        pass: ''
      }
    });

    var mailOptions = {
      from: 'mikedavidmackenzie@gmail.com',
      to: 'mike_mack7@hotmail.com',
      subject: 'subject test',
      text: data
    };

    transporter.sendMail(mailOptions, function(err, info) {
      if(err) {
        console.log(err.message);
      } else {
        console.log('Email sent: ' + info.response);
      }
      process.exit();
    });

  })
  .catch(err => {
    console.log("Some error occured: " + err);
  });
