module.exports = app => {
  const questions = require("../controllers/question.controller.js");

  var router = require("express").Router();

  // Create new question
  router.post("/", questions.createQuestion);

  // Retrieve N random questions
  router.get("/", questions.findSomeQuestions);

  app.use('/api/questions', router);
};
