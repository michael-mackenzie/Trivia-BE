module.exports = mongoose => {
  const User = mongoose.model(
    "user",
    mongoose.Schema(
      {
        email: String,
        nickname: String,
        attempts: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "attempt"
          }
        ]
      },
      { timestamps: true }
    )
  );

  return User;
};
