const axios = require('axios');
const schedule = require('node-schedule');
const nodemailer = require('nodemailer');
const User = require('./models/User');

const fetchWeather = async (location) => {
   try {
     const apiKey = 'e7338d9ea3782ccdce87d1561f486f69'; 
     const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`;

     const response = await axios.get(apiUrl);

     const { main, weather } = response.data;

     return {
       temperature: main.temp,
       description: weather[0].description,
     };
   } catch (error) {
     throw new Error('Error fetching weather data');
   }
};

// Schedule hourly weather reports
schedule.scheduleJob('0 * * * *', async () => {
  try {
    // Create a mail transporter
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'ravinduhapuarachchi2@gmail.com', 
        pass: 'Hapuarachchi@1234', 
      },
    });

    const users = await User.find({});
    for (const user of users) {
      const weatherData = await fetchWeather(user.location);

      // Create a weather data object
      const newWeatherData = {
        date: new Date(),
        temperature: weatherData.temperature,
        description: weatherData.description,
      };

      user.weatherData.push(newWeatherData);

      await user.save();

      const mailOptions = {
        from: 'your-email@gmail.com',
        to: user.email,
        subject: 'Your Weather Report',
        html: `
          <p>Hi there,</p>
          <p>This is your weather report for today:</p>
          <p>Temperature: ${newWeatherData.temperature}</p>
          <p>Description: ${newWeatherData.description}</p>
        `,
      };

      // Send the mail
      await transporter.sendMail(mailOptions);
    }
  } catch (error) {
    console.error('Error sending hourly weather reports', error);
  }
});


const createUser = async (req, res) => {
   try {
     // Extract user data from the request body
     const { email, location } = req.body;

     // Create a new user
     const user = new User({ email, location });

     // Save the user to the database
     await user.save();

     res.status(201).json(user);
   } catch (error) {
     console.error('Error creating user:', error);
     res.status(500).json({ error: 'Internal Server Error' });
   }
};

// Define the updateLocation function
const updateLocation = async (req, res) => {
  const userId = req.params.id;
  const newLocation = req.body.location;

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update the user's location
    user.location = newLocation;

    // Get the weather data for the new location
    const weatherData = await fetchWeather(newLocation);

    // Create a weather data object
    const newWeatherData = {
      date: new Date(),
      temperature: weatherData.temperature,
      description: weatherData.description,
    };

    // Push new weather data to user object
    user.weatherData.push(newWeatherData);

    // Save updated user object to database
    await user.save();

    res.status(200).json(user);
  } catch (error) {
    console.error('Error updating user location:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Define the getWeather function
const getWeather = async (req, res) => {
   const userId = req.params.id;
   const date = req.params.date;

   try {
     // Find the user by ID
     const user = await User.findById(userId);

     if (!user) {
       return res.status(404).json({ error: 'User not found' });
     }

     // Find weather data for the specified date
     const weatherForDate = user.weatherData.find((data) =>
       data.date.toISOString().startsWith(date)
     );

     if (!weatherForDate) {
       return res.status(404).json({ error: 'Weather data not found for the specified date' });
     }

     res.status(200).json(weatherForDate);
   } catch (error) {
     console.error('Error retrieving weather data:', error);
     res.status(500).json({ error: 'Internal Server Error' });
   }
};

// Export the functions
module.exports = {
   createUser,
   updateLocation,
   getWeather,
};
