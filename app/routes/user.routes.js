module.exports = app => {
  const users = require("../controllers/user.controller.js");

  var router = require("express").Router();

  //router.post("/", users.createUser);
  //router.get("/", users.findOneUser);

  // Retrieve or create one user
  router.post("/", users.findOrCreateUser);

  // Update user nickname
  router.put("/", users.updateUserNickname);

  // Create a new attempt
  router.post("/attempts/create", users.createAttempt);

  // Retrieve all daily user attempts
  router.post("/attempts", users.findAllUserAttempts);

  // Retrieve user order
  router.get("/leaderboard", users.findUserLeaderboard)

  app.use('/api/users', router);
};
