const { google } = require('googleapis');
const sheets = google.sheets('v4');
const mongoose = require("mongoose");
const db = require("./app/models");
const Question = db.questions;
require('dotenv').config()

const connection = db.url;

mongoose.connect(connection, {useNewUrlParser: true, useUnifiedTopology: true });

const rangeToGather = 'A2:G101'

const params = {
  auth: process.env["GOOGLE_API_KEY"],
  spreadsheetId: process.env["GOOGLE_SHEET_ID"],
  range: rangeToGather
}

sheets.spreadsheets.values.get(params).then(({data}) => {
  const parsedValues = data.values.map(question => {

    var answers = question.slice(1,5).filter(q => {
      return q !== '';
    });

    var answerArray = answers.map((answer, index) => {
      return {
        isCorrect: index == (question[5] - 1) ? true : false,
        text: question[index + 1]
      }
    });

    const result = {
      text: question[0],
      answers: answerArray,
      learnMore: question[6]
    }
    return result;
  });

  Question
    .deleteMany({})
    .then(response => {
      console.log(response);
    })
    .catch(err => {
      console.log(err || "Some error occurred when deleting");
    });

  var promiseArray = parsedValues.map((item, index) => {
    const question = new Question(item);
    return question.save(question);
  });

  Promise
    .all(promiseArray)
    .then(rsp => {
       console.log(rsp);
       mongoose.connection.close();
    })
    .catch(err => {
       console.log(err);
       mongoose.connection.close();
    });
});
