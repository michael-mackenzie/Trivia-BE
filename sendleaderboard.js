const db = require("./app/models");
const User = db.users;
var nodemailer = require('nodemailer');
const mongoose = require("mongoose");

require("dotenv").config();

const connection = db.url;

mongoose.connect(connection, {useNewUrlParser: true, useUnifiedTopology: true });

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
        user: process.env["USER_EMAIL"],
        pass: process.env["USER_PASS"]
      }
    });
    console.log(process.env["USER_EMAIL"])

    var mailOptions = {
      from: process.env["USER_EMAIL"],
      to: process.env["SEND_TO"],
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
