const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
      unique: true,
    },
    location: String,
    weatherData: [
      {
        date: Date,
        temperature: Number,
        description: String,
      },
    ],
  });

module.exports = mongoose.model('User', userSchema);
