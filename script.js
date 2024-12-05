const openWeatherApiKey = '49a717329f32d1a506a3d47a0cf3199e'; // Replace with your OpenWeatherMap API key

const input = document.getElementById('cityInput');

// Automatically fetch weather for user's location on page load
window.onload = () => {
    getLocationWeather();
};

document.getElementById('searchButton').addEventListener('click', () => {
    const city = input.value;
    if (city) {
        fetchWeatherData(city, false); // Fetch weather for the searched city
    } else {
        getLocationWeather();
    }
});

function getLocationWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            fetchWeatherData(null, true, latitude, longitude); // Fetch weather for user's location
        }, () => {
            alert("Unable to retrieve your location. Please enter a city name.");
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function fetchWeatherData(city, isUserLocation, lat, lon) {
    let url = `https://api.openweathermap.org/data/2.5/weather?`;
    if (city) {
        url += `q=${city}&`;
    } else {
        url += `lat=${lat}&lon=${lon}&`;
    }
    url += `appid=${openWeatherApiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (isUserLocation) {
                updateUserWeatherDisplay(data); // Update user's location weather
            } else {
                updateWeatherDisplay(data); // Update searched city weather
            }
        })
        .catch(error => console.error('Error fetching weather data:', error));
}

function updateWeatherDisplay(data) {
    const weatherDisplay = document.getElementById('weatherDisplay');
    const weatherCondition = data.weather[0].main.toLowerCase();
    const weatherImage = getWeatherImage(weatherCondition); // Get the corresponding image

    weatherDisplay.innerHTML = `
        <h2 class="city-name">${data.name}</h2>
        <p>${data.main.temp} °C</p>
        <p>${data.weather[0].description}</p>
        <img src="${weatherImage}" alt="${weatherCondition}" class="weather-image">
    `;
    document.body.className = weatherCondition; // Change background based on weather
}

function updateUserWeatherDisplay(data) {
    const userWeatherDisplay = document.getElementById('userWeatherDisplay');
    const weatherCondition = data.weather[0].main.toLowerCase();
    const weatherImage = getWeatherImage(weatherCondition); // Get the corresponding image

    userWeatherDisplay.innerHTML = `
        <h2 class="city-name">${data.name}</h2>
        <p>${data.main.temp} °C</p>
        <p>${data.weather[0].description}</p>
        <img src="${weatherImage}" alt="${weatherCondition}" class="weather-image">
    `;
}

function getWeatherImage(condition) {
    const images = {
        sunny: 'sunny.png',
        rainy: 'rain_7016161.png',
        cloudy: 'clouds_1281173.png',
        thunderstorm: 'thunderstorm_15555420.png',
        snow: 'snowflake_3725049.png',
        mist: 'windy_8047082.png',
        fog: 'smoke_17880428.png',
        haze: 'cloud_13202313.png',
        clear: 'cloudy-night_9231607.png',
        // Add more conditions and corresponding image paths
    };
    return images[condition] || 'interface_14067633.png'; // Default image if condition not found
}