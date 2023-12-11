
// Lets make a simple weather app that calls an API and displays the current weather and forecast for the next 7 days. The Geolocation interface doesn't inherit any method.
// Geolocation.getCurrentPosition() Secure context determines the device's current location and gives back a GeolocationPosition object with the data

// The GeolocationPosition object has two properties: coords and timestamp. The coords property is a GeolocationCoordinates object with the following properties: latitude, longitude, altitude, accuracy, altitudeAccuracy, heading, and speed. The timestamp property is a DOMTimeStamp object with the time of the location fix.

function saveUserLocation({ latitude, longitude, city_district }) { 
    // The saveUserLocation function takes the user's location as an argument
    localStorage.setItem('userLocation', JSON.stringify({ latitude, longitude, city_district })); 
    console.log(localStorage);
    // The localStorage.setItem() method saves the user's location to localStorage
};

document.addEventListener('DOMContentLoaded', function () { 
// The DOMContentLoaded event fires when the initial HTML document has been completely loaded and parsed, 
// without waiting for stylesheets, images, and subframes to finish loading.
const preloader = document.getElementById('preloader'); 
// The preloader variable contains the DOM element that will display the preloader
const currentTempElement = document.getElementById('current-temperature'); 
// The currentTempElement variable contains the DOM element that will display the current temperature

// Show the preloader before making the API request so veiwer has something onscreen
preloader.style.display = 'flex';

// Call the setupCurrentTemp function with your DOM element
setupCurrentTemp(currentTempElement);
}); // The DOMContentLoaded event fires when the initial HTML document has been completely loaded and parsed, 
// without waiting for stylesheets, images, and subframes to finish loading.

function setupCurrentTemp(currentTempElement) { // The setupCurrentTemp function takes the DOM element as an argument
navigator.geolocation.getCurrentPosition( // The getCurrentPosition() method is called to get the user's location
    function (position) { // The success callback is called when the position is successfully retrieved
        const latitude = position.coords.latitude; // The latitude variable contains the latitude of the user's location
        const longitude = position.coords.longitude; // The longitude variable contains the longitude of the user's location

        getCurrentTemp(latitude, longitude); // Call the getCurrentTemp function with the latitude and longitude
    }, // The success callback is called when the position is successfully retrieved
    function (error) { 
        console.error('Error getting user location:', error);
        // The error callback is called when the position is not successfully retrieved.
        currentTempElement.innerHTML = 'Error getting user location.'; 
    }
);

function getCurrentTemp(latitude, longitude) { // The getCurrentTemp function takes the latitude and longitude as arguments
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m`; // The apiUrl variable contains the API URL with the latitude and longitude

    axios.get(apiUrl) // Use Axios for the HTTP request
        .then(response => { // The then() method is called when the HTTP request is successful
            const data = response.data; // The data variable contains the data from the response
            console.log('API Response:', data); // The console.log() method logs the data from the response to the console

            // Use reverse geocoding to get the city name based on latitude and longitude
            getCityDistrict(latitude, longitude)
                .then(city_district => {
                    // Save the user's location to localStorage including the city name
                    saveUserLocation({ latitude, longitude, city_district });
                    console.log('city_district:', city_district);

                    // Display the current weather result with the city
                    showCurrentTemp(data, currentTempElement);

                    // Hide the preloader after data retrieval
                    preloader.style.display = 'none';
                })
                .catch(error => {
                    console.error('Error getting city name:', error);
                    // Handle error and hide preloader
                    currentTempElement.innerHTML = 'Error getting city name.';
                    preloader.style.display = 'none';
                });
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            // Handle error and hide preloader
            currentTempElement.innerHTML = 'Error fetching weather data.'; // Handle error and hide preloader
            preloader.style.display = 'none'; // Hide the preloader after data retrieval
        });
}

// Function to perform forward geocoding and get the city name using OpenCage Geocoding API
function getCityDistrict(latitude, longitude) { // The getCityDistrict function takes the latitude and longitude as arguments
const apiKey = '7e460d39f6b740de8e6141ce9f1bee38';
const forwardGeocodingApiUrl = `https://api.opencagedata.com/geocode/v1/json?key=${apiKey}&q=${latitude}+${longitude}&language=en`; // The forwardGeocodingApiUrl variable contains the API URL with the latitude and longitude and returns the city name

return axios.get(forwardGeocodingApiUrl) // Use Axios for the HTTP request
    .then(response => { // The then() method is called when the HTTP request is successful
        const results = response.data.results; // The results variable contains the data from the response
        // console.log('Geocoding API Response:', results);

        if (results && results.length > 0) { // The if statement checks if the results array is not empty
            const cityDistrictComponent = results[0].components.city_district; // The cityDistrictComponent variable contains the city name from the response

            if (cityDistrictComponent) { // The if statement checks if the cityDistrictComponent variable is not empty
                const city_district = cityDistrictComponent; // The city_district variable contains the city name from the response

                // Save the user's location to localStorage including the district
                saveUserLocation({ latitude, longitude, city_district }); 
                // The saveUserLocation function takes the user's location as an argument

                return city_district; // The return statement returns the city name
            } else { // The else statement is executed when the cityDistrictComponent variable is empty
                throw new Error('City district not found in forward geocoding response'); // The throw statement throws an error
            }
        } else { // The else statement is executed when the results array is empty
            throw new Error('No results found in forward geocoding response'); // The throw statement throws an error
        }
    })
    .catch(error => { // The catch() method is called when the HTTP request is not successful
        console.error('Error getting city district:', error); // The console.error() method logs the error to the console
        throw error; // The throw statement throws an error
    }); // The catch() method is called when the HTTP request is not successful
}

function showCurrentTemp(data, currentTempElement) { // The showCurrentTemp function takes the data and DOM element as arguments
if (data.current && data.current.temperature_2m) { // The if statement checks if the data.current.temperature_2m property is not empty
    const currentTemperature = data.current.temperature_2m; // The currentTemperature variable contains the current temperature from the response

    // Retrieve the city information from localStorage
    const userLocation = JSON.parse(localStorage.getItem('userLocation')); // The userLocation variable contains the user's location from localStorage
    console.log('userLocation:', userLocation);

    // Extract city from userLocation
    const city_district = userLocation ? userLocation.city_district : 'Your Suburb'; 
    // The city_district variable contains the city name from the user's location

    // Display the current weather result with the city
    currentTempElement.innerHTML = `<h2>The current temperature in ${city_district} is: ${currentTemperature} °C</h2>`;
} else {
    currentTempElement.innerHTML = 'Error: Unable to retrieve current temperature data.';
}
}
};

// Call the function with your DOM element
document.addEventListener('DOMContentLoaded', function () { 
// The DOMContentLoaded event fires when the initial HTML document has been completely loaded and parsed, without waiting for stylesheets, images, and subframes to finish loading.
const currentTempDiv = document.getElementById('current-temperature'); 
// The currentTempDiv variable contains the DOM element that will display the current temperature

// Call the setupCurrentTemp function with your DOM element
setupCurrentTemp(currentTempDiv);
});

document.addEventListener('DOMContentLoaded', function () { 
// The DOMContentLoaded event fires when the initial HTML document has been completely loaded and parsed, without waiting for stylesheets, images, and subframes to finish loading.
const forecastDiv = document.getElementById('forecast'); 
// The forecastDiv variable contains the DOM element that will display the weather forecast

// Get default weather and forecast based on user's location
getDefaultWeather();

function getDefaultWeather() { // The getDefaultWeather function gets the user's location from localStorage
    // Use the browser's geolocation API to get the user's location
    navigator.geolocation.getCurrentPosition( // The getCurrentPosition() method is called to get the user's location
        function (position) { // The success callback is called when the position is successfully retrieved
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            // Get weather and forecast based on the user's location using Axios
            getWeatherAndForecast(latitude, longitude);

            // Save the user's location to localStorage
            saveUserLocation({ latitude, longitude });
        },
        function (error) { // The error callback is called when the position is not successfully retrieved.
            console.error('Error getting user location:', error); // The error callback is called when the position is not successfully retrieved.
            forecastDiv.innerHTML = 'Error getting user location.'; // The error callback is called when the position is not successfully retrieved.
        }
    );
}

function getWeatherAndForecast(latitude, longitude) { 
    // The getWeatherAndForecast function takes the user's location as arguments
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum`; 
    // The apiUrl variable contains the API URL with the user's location

    // Use Axios for the HTTP request
    axios.get(apiUrl) // The then() method is called when the HTTP request is successful
        .then(response => { // The then() method is called when the HTTP request is successful
            // Handle the data from the response
            const data = response.data; // The data variable contains the data from the response

            // Display weather forecast for the next 5 days
            displayWeatherForecast(data); 
            // Call the displayWeatherForecast function with the data from the response
            console.log(data); // The console.log() method logs the data from the response to the console
        })
        .catch(error => { // The catch() method is called when the HTTP request is not successful
            console.error('Error fetching weather data:', error); // Handle the error
            forecastDiv.innerHTML = 'Error fetching weather data.'; // Handle the error
        }); // Handle the error
}

function displayWeatherForecast(data) { 
    // The displayWeatherForecast function takes the data from the response as an argument
    const forecastItemsContainer = document.getElementById('forecast-items'); 
    // The forecastItemsContainer variable contains the DOM element that will display the weather forecast
  
    if ( // The if statement checks if the data.daily.temperature_2m_max, data.daily.temperature_2m_min, data.daily.precipitation_sum, and data.daily.time properties are not empty
      data.daily &&
      data.daily.temperature_2m_max &&
      data.daily.temperature_2m_min &&
      data.daily.precipitation_sum &&
      data.daily.time
    ) {
      // Clear previous forecast items
      forecastItemsContainer.innerHTML = '';
  
      for (let i = 0; i < data.daily.time.length; i++) { // The for loop iterates through the data.daily.time array
        // Create a forecast item element
        const forecastItem = document.createElement('div'); 
        // The forecastItem variable contains the DOM element that will display the forecast item
        forecastItem.classList.add('forecast-item'); 
        // The classList.add() method adds the forecast-item class to the forecast item
  
        // Populate the forecast item with data
        forecastItem.innerHTML = 
        // The forecastItem variable contains the DOM element that will display the forecast item
        `<p>${data.daily.time[i]}</p>
          <p>Max: ${data.daily.temperature_2m_max[i]} °C</p>
          <p>Min: ${data.daily.temperature_2m_min[i]} °C</p>
          <p>Rain: ${data.daily.precipitation_sum[i]} mm</p>
        `;
  
        // The appendChild() method appends the forecast item to the container
        forecastItemsContainer.appendChild(forecastItem); 
      }
    } else { // The else statement is executed when the data.daily.temperature_2m_max, data.daily.temperature_2m_min, data.daily.precipitation_sum, and data.daily.time properties are empty
      forecastItemsContainer.innerHTML = 'Error: Unable to retrieve weather forecast data.'; // Handle the error
    }
  }

}); // The DOMContentLoaded event fires when the initial HTML document has been completely loaded and parsed, without waiting for stylesheets, images, and subframes to finish loading.

document.addEventListener('DOMContentLoaded', function () { 
// The DOMContentLoaded event fires when the initial HTML document has been completely 
// loaded and parsed, without waiting for stylesheets, images, and subframes to finish loading.
const backgroundImageElement = document.getElementById('background-img'); 
// The backgroundImageElement variable contains the DOM element that will display the background image
const backgroundImages = [ // Array of image URLs
    'https://chatelaine.com/wp-content/uploads/2021/06/summer-weather-canada-2021-environment-canada.jpg',
    'https://ireporteronline.com.ng/wp-content/uploads/2023/09/Rain.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Port_and_lighthouse_overnight_storm_with_lightning_in_Port-la-Nouvelle.jpg/1200px-Port_and_lighthouse_overnight_storm_with_lightning_in_Port-la-Nouvelle.jpg',
    'https://cdn.fstoppers.com/styles/large-16-9/s3/lead/2022/04/img-90dad494-faa0-4591-85d9-7695a7c38f54.jpeg',
    'https://www.almanac.com/sites/default/files/styles/or/public/image_nodes/sunset-beach.jpeg?itok=fnnrbsVE',
    'https://media.istockphoto.com/id/922668632/photo/residential-street-covered-with-fresh-snow-during-a-blizzard.jpg?s=612x612&w=0&k=20&c=c_LRE5gsgbdPkdWRAz4AuP30S6zgIxQWUEW0NA6MrC4=',
    'https://www.visittheusa.com/sites/default/files/styles/hero_l/public/2016-10/Weather_Seasons.__72%20DPI.jpg?itok=Bq3U59BK',
    // Add more image URLs as needed
]; // Array of image URLs

let currentIndex = 0; // The currentIndex variable contains the index of the current image

function changeBackgroundImage() { // The changeBackgroundImage function changes the background image
    backgroundImageElement.src = backgroundImages[currentIndex];
    // The backgroundImageElement variable contains the DOM element that will display the background image
    currentIndex = (currentIndex + 1) % backgroundImages.length;
} // The changeBackgroundImage function changes the background image

changeBackgroundImage(); // Call the changeBackgroundImage function
setInterval(changeBackgroundImage, 10000); // The setInterval() method calls the changeBackgroundImage function every 4 seconds

});
