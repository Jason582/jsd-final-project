

// **************************************************************************************************************
// THIS IS A JAVASCRIPT WEATHER APP THAT UTILIZES THE OPEN METEO API & THE OPENCAGE GEOCODING API TO FETCH THE CURRENT WEATHER
//  AND 7 DAY FORECAST FOR THE USER'S LOCATION. IT ALSO PROVIDES FUNTIONALITY TO CHANGE THE BACKGROUND IMAGE EVERY 10 SECONDS 
// AND SAVE THE USERS LOCATION IN THE BROWSERS LOCAL STORAGE TO RETRIEVE LATER WITHOUT MAKING ANOTHER API REQUEST.
// **************************************************************************************************************


// ======================================================================================================================================
// **********************************************              FUNCTIONS           ***************************************************
// ======================================================================================================================================

// ======================================================================================================================================
// **********************************************     1   Saving User Location          ***************************************************
    // This function takes latitude, longitude, and city_district as parameters, then stores this information in the browser's local storage 
    // under the key 'userLocation' as a JSON string.
// ======================================================================================================================================
// THIS SETS UP THE GLOBAL OBJECT PROPERTY LOCALSTORAGE WITH THE USER'S LOCATION - LAT LONG city_district//
// and keeps the data in the browser's local storage so that the user's location can be retrieved later without making another API request - no expiration time!

function saveUserLocation({ latitude, longitude, city_district }) {
    // The saveUserLocation function takes the user's location as an argument

    localStorage.setItem('userLocation', JSON.stringify({ latitude, longitude, city_district }));
    // Takes an OBJECT with latitude, longitude, and city_district properties as an argument.
    // Stores the user's location information in the browser's local storage under the key 'userLocation' as a JSON string.

    // ***************************************************************************************

    // UNCOMMENT TO SHOW LOCALSTORAGE IN CONSOLE
    // console.log(`LocalStorage =`, localStorage); 
    // to debug and see the data in the console in case of any errors

    // ***************************************************************************************

}; // So, when you call saveUserLocation with an object containing latitude, longitude, and city_district, it will store that information in the browser's localStorage under the key 'userLocation'



// ======================================================================================================================================
// **********************************************     2   Getting Current Temperature     ************************************************
// ======================================================================================================================================
// This function initiates the process of obtaining the user's geolocation. Upon success, it calls getCurrentTemp to fetch and display the 
// current temperature.

// THE Geolocation.getCurrentPosition() METHOD IS USED TO GET THE CURRENT POSITION OF THE DEVICE.
// the setupCurrentTemp function is designed to initiate the process of obtaining the user's geolocation, handling both successful and unsuccessful cases. If successful, it then calls another function (getCurrentTemp) to fetch and display the current temperature based on the user's location. 

function setupCurrentTemp(currentTempElement) {
    // The setupCurrentTemp function takes the DOM element (currentTempElement) as the argument

    navigator.geolocation.getCurrentPosition(
        // The getCurrentPosition() method is called to get the user's location information
        function (position) { // The SUCCESS callback is called when the position is successfully retrieved

            const latitude = position.coords.latitude; // The latitude variable contains the latitude of the user's location
            const longitude = position.coords.longitude; // The longitude variable contains the longitude of the user's location

            // On success, it calls the getCurrentTemp function to fetch and display the current temperature based on the user's location.

            getCurrentTemp(latitude, longitude); // getCurrentTemp can make an API request to get the current temperature

        }, // The success callback is called when the position is successfully retrieved

        function (error) {
            console.error('Error getting user location:', error); // ERROR IN RED
            // The error callback is called when the position is not successfully retrieved.
            currentTempElement.innerHTML = 'Error getting user location.'; // Handle the error
        }
    );


// ======================================================================================================================================
// **************************************    3 (2 continued) Getting Current Temperature    *********************************************
// ======================================================================================================================================
    // This function constructs the API URL for Open Meteo to get the current temperature and uses Axios for making an HTTP request. 
    // It also handles the response and saves the user's location to local storage./


    function getCurrentTemp(latitude, longitude) {

        // The getCurrentTemp function takes the latitude and longitude as arguments then 
        // Constructs the API URL for Open Meteo to get the current temperature - 2mtres above ground level

        const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m`;
        // The apiUrl variable contains the API URL with the latitude and longitude

        axios.get(apiUrl) // Use Axios for the HTTP request - promise based - GET request
            // The .then() method handles the success case, and the .catch() method handles errors.

            .then(response => { // The then() method is called when the HTTP request is successful
                const data = response.data; // The data variable contains the data from the response

                console.log('API Response:', data); // for debugging etc - to see the data in the console

                // 'Success' calls the getCityDistrict function - to REVERSE GEOCODE THE SUBURB NAME
                getCityDistrict(latitude, longitude)
                    // getCityDistrict() function to perform reverse geocoding and get the suburbs name 
                    //based on the latitude and longitude returned by the getCurrentPosition() method

                    .then(city_district => {

                        // Save the user's location to localStorage including the 
                        // SUBURB'S (CITY_DISTRICT) name

                        saveUserLocation({ latitude, longitude, city_district });
                        console.log('city_district:', city_district);
                        // If successful, calls saveUserLocation to save the user's 
                        // location to localStorage along with the city_district name.

                        // Displays the current temperature
                        showCurrentTemp(data, currentTempElement); // refer 174 for function

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
    } // getCurrentTemp



// ======================================================================================================================================
// *********************************     4   Reverse Geocoding (Getting City/Suburb Name)     **************************************
// ======================================================================================================================================
// This function uses the OpenCage Geocoding API to perform reverse geocoding and retrieve the city or suburb name based on the 
// provided latitude and longitude.


    function getCityDistrict(latitude, longitude) { // The getCityDistrict function takes the latitude and longitude as arguments

        const apiKey = '7e460d39f6b740de8e6141ce9f1bee38';
        const forwardGeocodingApiUrl = `https://api.opencagedata.com/geocode/v1/json?key=${apiKey}&q=${latitude}+${longitude}&language=en`;
        // The forwardGeocodingApiUrl variable uses OpenCage Geocoding API to perform forward geocoding and retrieve the suburb (city_district) name.

        return axios.get(forwardGeocodingApiUrl) // Use Axios for the HTTP request

            .then(response => { // The then() method is called when the HTTP request is successful

                const results = response.data.results; // The results variable contains the data from the response
                console.log('Geocoding API Response:', results); // The console.log() method logs the data from the response to the console

                if (results && results.length > 0) { // The if statement checks if the results array is not empty
                    const cityDistrictComponent = results[0].components.city_district; // To retrive the json data from the api
                    // The cityDistrictComponent variable contains the suburb name from the response

                    if (cityDistrictComponent) { // The if statement checks if the cityDistrictComponent variable is not empty
                        const city_district = cityDistrictComponent; // The city_district variable contains the city name from the response

                        // Save the user's location to localStorage including the district
                        saveUserLocation({ latitude, longitude, city_district });
                        // The saveUserLocation function takes the user's location as an argument

                        return city_district; // The return statement returns the suburb name

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

    }; // getCityDistrict



// ======================================================================================================================================
// *********************************     5   Displaying Current Temperature     **************************************
// ======================================================================================================================================
    // This function takes the data and a DOM element (currentTempElement) and displays the current temperature on the page. 
    // THIS DISPLAYS THE CURRENT TEMPERATURE IN YOUR SUBURB USING THE city_district(Suburb) and currentTemperature variables

    function showCurrentTemp(data, currentTempElement) {
        // The showCurrentTemp function takes the data and DOM element (currentTempElement) as arguments

        if (data.current && data.current.temperature_2m) {
            // The if statement checks if the data.current.temperature_2m property is not empty
            // This is done to ensure that the temperature data is available in the data object

            const currentTemperature = data.current.temperature_2m;
            // If the temperature data is available, extracts the current temperature from the data object

            // Retrieve the city_district information from localStorage
            const userLocation = JSON.parse(localStorage.getItem('userLocation'));
            // Parses the JSON string stored in localStorage and assigns it to the userLocation variable.

            console.log('userLocation:', userLocation); // do a check to see if successful/debugging

            // Extract city from userLocation
            const city_district = userLocation ? userLocation.city_district : 'Your Suburb';
            // Checks if userLocation is truthy (not null or undefined) and assigns the city_district property to the city_district variable.
            //  If userLocation is falsy, assigns the string 'Your Suburb' to the city_district variable.

            // Displaying ON PAGEthe current weather result with the suburb and information retrieved from the API
            currentTempElement.innerHTML = `<h2>The current temperature in ${city_district} is: ${currentTemperature} °C</h2>`;

        } else {

            currentTempElement.innerHTML = 'Error: Unable to retrieve current temperature data.'; // Handle the error
        }
    }
}; // setupCurrentTemp



// ======================================================================================================================================
// *********************************     6   Getting 7-Day Forecast     **************************************
// ======================================================================================================================================
    // This function constructs the API URL for Open Meteo to get the 7-day forecast and uses Axios for making an HTTP request. 

// THIS GETS THE 7 DAYS FORECAST //the getWeatherAndForecast function fetches weather and forecast data from the Open Meteo API based on the provided latitude and longitude. It uses Axios for the HTTP request, handles both successful and error cases, and calls a function (displayWeatherForecast) to handle the rendering of the weather forecast on the page.


function getWeatherAndForecast(latitude, longitude) {
    // The getWeatherAndForecast function takes the user's location (latitude & longitude) as arguments

    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum`;
    // Constructs an API URL for fetching weather and forecast data based on the provided latitude and longitude. The URL includes parameters like daily=temperature_2m_max,temperature_2m_min,precipitation_sum to request daily maximum and minimum temperatures, as well as precipitation data.

    // Uses Axios to make a GET request to the specified API URL - HTTP request
    axios.get(apiUrl) // The then() method is called when the HTTP request is successful

        .then(response => { // The then() method is called when the HTTP request is SUCCESSFUL
            // Handle the data from the response

            const data = response.data; // If the HTTP request is successful, extracts the data from the response and assigns it to the variable data.

            // Calls the displayWeatherForecast function with the obtained data to handle the display of the 7 days weather forecast
            displayWeatherForecast(data);
            // Call the displayWeatherForecast function with the data from the response

            // console.log(data); // The console.log() method logs the data from the response to the console
        })
        .catch(error => { // The catch() method is called when the HTTP request is NOT SUCCESSFUL

            console.error('Error fetching weather data:', error); // Handle the error
            forecastDiv.innerHTML = 'Error fetching weather data.'; // Handle the error

        }); // Handle the error
}; // getWeatherAndForecast




// ======================================================================================================================================
// *********************************     7   Displaying 7-Day Forecast     **************************************
// ======================================================================================================================================
    // This function takes data from the weather API response and renders the 7-day weather forecast on the web page. 
    // It creates individual forecast items for each day.

// THIS DISPLAYS THE 7 DAY FORECAST // the displayWeatherForecast function is responsible for rendering the 7-day weather forecast on the web page based on the data received from the weather API. It creates individual forecast items for each day and appends them to the forecast container. If there's an issue with the data, it displays an error message in the forecast container.

function displayWeatherForecast(data) {

    // Declares a function named displayWeatherForecast that takes data from the weather API response as an argument.
    const forecastItemsContainer = document.getElementById('forecast-items');
    // The forecastItemsContainer variable contains the DOM element that will display the weather forecast - ID 'forecast-items'

    if ( // The if statement checks if the data.daily.temperature_2m_max, data.daily.temperature_2m_min, data.daily.precipitation_sum, and data.daily.time properties are not empty - if true, the code inside the if statement is executed
        data.daily &&
        data.daily.temperature_2m_max &&
        data.daily.temperature_2m_min &&
        data.daily.precipitation_sum &&
        data.daily.time

    ) {

        // Clear previous forecast items first
        forecastItemsContainer.innerHTML = '';

        for (let i = 0; i < data.daily.time.length; i++) { // The for loop iterates through the data.daily.time array

            // Create a forecast item element
            const forecastItem = document.createElement('div');
            // The forecastItem variable contains the DOM element that will display the forecast item

            forecastItem.classList.add('forecast-item');
            // The classList.add() method adds the forecast-item class to the forecast item

            // Populate the forecast item with data

            forecastItem.innerHTML =

                // Uses a for loop to iterate through the data.daily.time array, creating a forecast item for each day.
                // Creates a div element for each forecast item and sets its class to 'forecast-item'.
                // Populates each forecast item with information such as the date, maximum temperature, minimum temperature, and precipitation.

                `<p>${data.daily.time[i]}</p>
                            <p>Max: ${data.daily.temperature_2m_max[i]} °C</p>
                            <p>Min: ${data.daily.temperature_2m_min[i]} °C</p>
                            <p>Rain: ${data.daily.precipitation_sum[i]} mm</p>
                            `;

            // The appendChild() method appends the forecast item to the container
            forecastItemsContainer.appendChild(forecastItem);

            // console.log(forecastItem); 
            // The console.log() method logs the forecast item (or items as in this case - 7 days forecast)  to the console
        }

    } else { // The else statement is executed when the data.daily.temperature_2m_max, data.daily.temperature_2m_min, data.daily.precipitation_sum, and data.daily.time properties are empty

        forecastItemsContainer.innerHTML = 'Error: Unable to retrieve weather forecast data.'; // Handle the error

    }
}; // displayWeatherForecast


// ======================================================================================================================================
// *********************************     EVENT LISTENERS and BACKGROUND IMAGE Handling     *****************************************
// ======================================================================================================================================
    // This part includes event listeners for when the DOM is fully loaded. It initializes various elements on the page, sets up a preloader, 
    // and handles the display of background images in a slideshow rotating  every 10 seconds.

// EVENT LISTENER - SETUP THE PRELOADER WHILST THE API IS LOADING
// Initial setup of page - preloader and current temperature

document.addEventListener('DOMContentLoaded', function () {
    // The document.getElementById method is used to retrieve DOM elements by their respective IDs. 
    // These elements (ID's) are referenced by the variables const preloader and const currentTempElement
    // You can now reference these in your style sheets to manipulate the DOM elements

    const preloader = document.getElementById('preloader');
    // The preloader variable contains the DOM element that will display the preloader

    const currentTempElement = document.getElementById('current-temperature');
    // The currentTempElement variable contains the DOM element that will display the current temperature on page

    const forecastDiv = document.getElementById('forecast');
    // The forecastDiv variable contains the DOM element that will display the 7 day weather forecast

    // THIS LOADS AND DISPLAYS THE BACKGROUND IMAGES AND ANIMATIONS //
    // The DOMContentLoaded event fires when the initial HTML document has been completely 
    // loaded and parsed, without waiting for stylesheets, images, and subframes to finish loading.

    const backgroundImageElement = document.getElementById('background-img');
    // Retrieves the DOM element with the ID 'background-img', which is intended to display the background image.

    const backgroundImages = [ // Creates an array backgroundImages containing URLs of background images...

        'https://chatelaine.com/wp-content/uploads/2021/06/summer-weather-canada-2021-environment-canada.jpg',
        'https://ireporteronline.com.ng/wp-content/uploads/2023/09/Rain.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Port_and_lighthouse_overnight_storm_with_lightning_in_Port-la-Nouvelle.jpg/1200px-Port_and_lighthouse_overnight_storm_with_lightning_in_Port-la-Nouvelle.jpg',
        'https://cdn.fstoppers.com/styles/large-16-9/s3/lead/2022/04/img-90dad494-faa0-4591-85d9-7695a7c38f54.jpeg',
        'https://www.almanac.com/sites/default/files/styles/or/public/image_nodes/sunset-beach.jpeg?itok=fnnrbsVE',
        'https://media.istockphoto.com/id/922668632/photo/residential-street-covered-with-fresh-snow-during-a-blizzard.jpg?s=612x612&w=0&k=20&c=c_LRE5gsgbdPkdWRAz4AuP30S6zgIxQWUEW0NA6MrC4=',
        'https://www.visittheusa.com/sites/default/files/styles/hero_l/public/2016-10/Weather_Seasons.__72%20DPI.jpg?itok=Bq3U59BK',
        // Add more image URLs as needed

    ]; // Array of image URLs

    // Show the preloader whilst screen is populating etc
    preloader.style.display = 'flex'; // CSS flexbox layout is used to display the preloader

    // This function is called and displays the current temperature through the ID 'current-temperature' DOM element
    setupCurrentTemp(currentTempElement);

    // Retrieves DOM elements for displaying current temperature and forecast, calls functions to set up the display of current temperature, 
    // and initiates the process of getting weather and forecast data based on the user's location using the geolocation API.
    // and for the 7 day forecast - ('forecast')

    // Get default weather and forecast based on user's location
    getDefaultWeather(); // Calls the getDefaultWeather function, which gets the default weather 
    // and forecast based on the user's location.

    function getDefaultWeather() { // The getDefaultWeather function gets the user's location from localStorage
        // Use the browser's geolocation API to get the user's location

        navigator.geolocation.getCurrentPosition( // The getCurrentPosition() method is called to get the user's location
            function (position) { // The success callback is called when the position is successfully retrieved

                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                // Get weather and forecast based on the user's location using Axios
                getWeatherAndForecast(latitude, longitude);

                // Save the user's location to localStorage
                // saveUserLocation({ latitude, longitude });
            },

            function (error) { // The error callback is called when the position is not successfully retrieved.

                console.error('Error getting user location:', error);
                // The error callback is called when the position is not successfully retrieved.

                forecastDiv.innerHTML = 'Error getting user location.';
                // The error callback is called when the position is not successfully retrieved.

            }
        );
    }

    let currentIndex = 0; // Initializes a variable currentIndex to 0. 
    // This variable will keep track of the index of the current background image.

    function changeBackgroundImage() { // Defines a function changeBackgroundImage that updates the src attribute of 
        // backgroundImageElement with the URL of the current background image.
        // Increments currentIndex to move to the next image in the array. It uses the modulo operator to loop back 
        // to the beginning of the array when reaching the end.

        backgroundImageElement.src = backgroundImages[currentIndex];
        // The backgroundImageElement variable contains the DOM element that will display the background image

        // If currentIndex + 1 is greater than or equal to backgroundImages.length, the modulo operation will wrap the value back to the beginning of the array. So keeps going from 1 - 7 and then back to 1 again - because there are 7 images in the array.
        currentIndex = (currentIndex + 1) % backgroundImages.length; // find the remainder of the division of one number by another (the modulus operator)

    } // The changeBackgroundImage function changes the background image

    changeBackgroundImage(); // Call the changeBackgroundImage function
    setInterval(changeBackgroundImage, 10000); // Calls changeBackgroundImage initially to set the initial background image.
    // Sets up an interval using setInterval to call changeBackgroundImage every 
    // 10,000 milliseconds (10 seconds), creating a slideshow-like animation of background images.


}); // The DOMContentLoaded event fires when the initial HTML document has been completely loaded and parsed, without waiting for stylesheets, images, and subframes to finish loading.
