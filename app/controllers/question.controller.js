const db = require("../models");
const Question = db.questions;

exports.createQuestion = (req, res) => {
  if(!req.body.text) {
    res.status.send({ message: "Content can not be empty!"});
    return;
  }

  const question = new Question({
    text: req.body.text,
    answers: req.body.answers,
    learnMore: req.body.learnMore
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
    .aggregate([{ $sample: { size: 15 }}])
    .exec(function(err, rsp) {
      res.send(rsp);
    });
};

exports.deleteAll = (req, res) => {
  Question
    .deleteMany({})
    .then(response => {
      res.send(response.data);
      console.log("deleted all")
    })
    .catch(err => res.send(err));
}
