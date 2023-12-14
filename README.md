# Final-Project

This is a weather application that utilizes the Open Meteo API and the OpenCage Geocoding API to fetch the current weather and a 7-day forecast based on the user's location. It also includes functionality to change the background image every 10 seconds (plus a zooming effect CSS based) and saves the user's location in the browser's local storage for future retrieval without making additional API requests.

Heres a breakdown:

1. saveUserLocation Function:
Purpose: Saves the user's location (latitude, longitude, and city_district) in the browser's local storage.
How it works: Accepts an object containing latitude, longitude, and city_district properties, converts it to a JSON string, and stores it in the localStorage with the key 'userLocation'.

2. setupCurrentTemp Function:
Purpose: Initiates the process of obtaining the user's geolocation and, upon success, calls the getCurrentTemp function to fetch and display the current temperature.
How it works: Uses navigator.geolocation.getCurrentPosition to get the user's current position. If successful, it calls getCurrentTemp with the latitude and longitude.

3. getCurrentTemp Function:
Purpose: Fetches the current temperature from the Open Meteo API and handles the response.
How it works: Constructs the API URL, makes a GET request using Axios, and processes the response. It also uses the OpenCage Geocoding API to perform reverse geocoding and get the suburb name based on the latitude and longitude.

4. getCityDistrict Function:
Purpose: Performs forward geocoding using the OpenCage Geocoding API to retrieve the suburb (city_district) name.
How it works: Constructs the API URL, makes a GET request using Axios, and processes the response to extract the suburb name.

5. showCurrentTemp Function:
Purpose: Displays the current temperature on the page, including the suburb name.
How it works: Extracts the current temperature and suburb name from the API response and displays the information on the page.

6. getWeatherAndForecast Function:
Purpose: Fetches weather and forecast data from the Open Meteo API based on the provided latitude and longitude.
How it works: Constructs the API URL, makes a GET request using Axios, and calls displayWeatherForecast to handle rendering the 7-day forecast.

7. displayWeatherForecast Function:
Purpose: Renders the 7-day weather forecast on the web page.
How it works: Creates forecast items for each day and appends them to the forecast container. Handles errors if data is unavailable.

8. Event Listeners:
DOMContentLoaded Event Listener: Initiates the page setup, including displaying the preloader, current temperature, and initiating the process of getting weather and forecast data.
Background Image Loading: Sets up an interval to change the background image every 10 seconds.

Additional Notes:
The code uses Axios for making HTTP requests.
Background images are cycled every 10 seconds, creating a slideshow effect.
Error handling is implemented for geolocation and API requests.
It's a script that combines geolocation, weather API requests, background image cycling, and local storage for a dynamic weather application.

FURTHER WORK: Would like to expand on the current design both visually and functionally, perhaps include features that convert 'date' json data to days of the week so it feels more personal. Could also perhaps include a form for users to check weather patterns somewhere else in case of future trips etc.

https://jason582.github.io/jsd-final-project/
