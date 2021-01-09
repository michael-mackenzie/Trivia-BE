module.exports = mongoose => {
  const Attempt = mongoose.model(
    "attempt",
    mongoose.Schema(
      {
        email: String,
        score: Number,
        numberOfQuestions: Number
      },
      { timestamps: true }
    )
  );

  return Attempt;
};
