const db = require("../models");
const Question = db.questions;

exports.createQuestion = (req, res) => {
  if(!req.body.text) {
    res.status.send({ message: "Content can not be empty!"});
    return;
  }

  const question = new Question({
    text: req.body.text,
    answers: req.body.answers
  });

  question
    .save(question)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating Question."
      });
    });
};

exports.findSomeQuestions = (req, res) => {
  Question
    .aggregate([{ $sample: { size: 3 }}])
    .exec(function(err, rsp) {
      res.send(rsp);
    });
};
