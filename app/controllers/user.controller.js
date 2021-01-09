const db = require("../models");
const User = db.users;
const Attempt = db.attempts;

exports.findOrCreateUser = (req, res) => {
  if(!req.body.email) {
    res.status(500).send({ message: "Content can not be empty!"});
    return;
  }

  User
    .findOne({email: req.body.email})
    .then(response => {
      if(!response) {
        console.log("doesn't exist");

        const user = new User({
          email: req.body.email,
          nickname: '',
          attempts: []
        });

        user
          .save(user)
          .then(data => {
            res.send(data);
          })
          .catch(err => {
            console.log("error test creation");
            res.status(500).send({
              message: err.message || "Some error occurred while creating user."
            });
          });
      }
      else if(response) {
        console.log("exists");
        res.send(response);
      }
    })
    .catch(err => {
      console.log("error test found");
      res.status(500).send({
        message: err.message || "Some error occurred while finding user."
      });
    });
}

exports.updateUserNickname = (req, res) => {
  if(!req.body.nickname) {
    res.status(500).send({ message: "Content can not be empty!"});
    return;
  }

  var filter = {
    email: req.body.email
  }

  var update = {
    nickname: req.body.nickname
  }

  User
    .findOneAndUpdate(filter, update, {new: true})
    .then(response => res.send(response));
}

/*
exports.createUser = (req, res) => {
  if(!req.body.email) {
    res.status.send({ message: "Content can not be empty!"});
    return;
  }

  const user = new User({
    email: req.body.email,
    attempts: []
  });

  console.log("create");

  user
    .save(user)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating User."
      });
    });
};

exports.findOneUser = (req, res) => {
  console.log("find");
  User
    .findOne({email: req.body.email})
    .then(user => {
      if(!user) {
        console.log("doesn't exist")
      }
      else if(user) {
        console.log("exists")
      }
      res.send(user);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while finding all users."
      });
    });
};
*/

exports.createAttempt = (req, res) => {
  const attempt = new Attempt({
    email: req.body.email,
    score: req.body.score,
    numberOfQuestions: req.body.numOfQs
  });

  attempt
    .save(attempt)
    .then(docAttempt => {
      console.log("New Attempt Created");
      res.send(docAttempt)
      const query = { email: req.body.email };

      return User.findOneAndUpdate(
        query,
        { $addToSet: { attempts: docAttempt._id } },
        { new: true, useFindAndModify: false }
      );
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating an attempt."
      });
    });
};

exports.findAllUserAttempts = (req, res) => {
  condition = { email: req.body.email };
  User
    .findOne(condition).populate("attempts")
    .then(user => {
      var start = new Date();
      var end = new Date();
      start.setHours(0,0,0,0);
      end.setHours(23,59,59,999);

      var todaysAttempts = user.attempts.filter(function(att) {
        return att.createdAt.getTime() > start.getTime();
      });

      var todaysScore = todaysAttempts.reduce(function(a, b){
        return a + b["score"]
      }, 0);

      data = {
        todaysAttempts: todaysAttempts.length,
        todaysScore: todaysScore
      };

      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while finding all user attempts."
      });
    });
};

exports.findUserLeaderboard = (req, res) => {
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
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while finding all users."
    });
  });
};
