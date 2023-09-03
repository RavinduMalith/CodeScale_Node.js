# CodeScale_Node.js
Selection Assessment For Internship in Software Engineering

1)Navigate to the project directory:
	cd weather-report-api

2)Install the project dependencies:
	npm install

3)Running the API:
	npm start

The server will run on port 3000 by default. You can access the API at 
"http://localhost:3000"

4)API Endpoints
Create a User

	URL: http://localhost:3000/api/users/
	Method: POST
	Request Body:
		{
 			 "email": "user@example.com",
 			 "location": "New York"
		}


Update User Location

	URL: http://localhost:3000/api/users/:id (Replace :id with the user's actual ID)
	Method: PUT
	Request Body:
		{
  			"location": "Los Angeles"
		}


Get Weather Data

	URL: http://localhost:3000/api/users/:id/weather/:date (Replace :id and :date with the user's ID and a valid date)
	Method: GET
