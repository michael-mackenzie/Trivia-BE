module.exports = mongoose => {
  const Question = mongoose.model(
    "question",
    mongoose.Schema(
      {
        text: String,
        answers: [
          {
            isCorrect: Boolean,
            text: String
          }
        ]
      },
      { timestamps: true }
    )
  );

  return Question;
};
