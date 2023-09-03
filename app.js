const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const UserController = require('./UserController');
require('dotenv').config();


const app = express();
app.use(bodyParser.json());


mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define routes
app.post('/api/users', UserController.createUser);
app.put('/api/users/:id', UserController.updateLocation); 
app.get('/api/users/:id/weather/:date', UserController.getWeather);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
