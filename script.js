const apiKey = "8a8c422e1251d6a91b43f631a4ccbc00";

const weatherDataEle = document.querySelector(".weather-data");
const cityNameEle = document.querySelector("#city-name");
const formEle = document.querySelector("form");
const imgIcon = document.querySelector(".icon");
const timeEle = document.querySelector("#time");

formEle.addEventListener("submit", (e) => {
    e.preventDefault();
    const cityValue = cityNameEle.value;
    getWeatherData(cityValue);
});

async function getWeatherData(cityValue) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${cityValue}&appid=${apiKey}&units=metric`
        );

        if (!response.ok) {
            throw new Error("City not found");
        }

        const data = await response.json();
        const temprature = Math.floor(data.main.temp);
        const description = data.weather[0].description;
        const icon = data.weather[0].icon;
        const timezoneOffset = data.timezone; // Timezone offset in seconds

        const details = [
            `Feels Like: ${Math.floor(data.main.feels_like)}°C`,
            `Humidity: ${data.main.humidity}%`,
            `Wind Speed: ${data.wind.speed} m/s`,
        ];

        weatherDataEle.querySelector(".temp").textContent = `${temprature}°C`;
        weatherDataEle.querySelector(".desc").textContent = `${description}`;
        imgIcon.innerHTML = `<img src="https://openweathermap.org/img/wn/${icon}.png" alt="">`;
        weatherDataEle.querySelector(".details").innerHTML = details
            .map((detail) => `<div>${detail}</div>`)
            .join("");

        displayTime(timezoneOffset); // Display time for the city's region
        setInterval(() => displayTime(timezoneOffset), 1000); // Update time every second

        changeBackgroundColor(description.toLowerCase());
    } catch (err) {
        weatherDataEle.querySelector(".temp").textContent = "";
        imgIcon.innerHTML = "";
        weatherDataEle.querySelector(".desc").textContent =
            "City not found. Please try again!";
    }
}

// Display current time based on the region's timezone offset
function displayTime(timezoneOffset) {
    const now = new Date();
    const utcTime = now.getTime() + now.getTimezoneOffset() * 60000; // Convert to UTC
    const regionTime = new Date(utcTime + timezoneOffset * 1000); // Adjust with timezone offset

    let hours = regionTime.getHours();
    const minutes = regionTime.getMinutes();
    const seconds = regionTime.getSeconds();
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12; // Convert to 12-hour format

    const timeString = `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")} ${ampm}`;

    timeEle.textContent = `Current time: ${timeString}`;
}

// Change background based on weather condition
function changeBackgroundColor(condition) {
    document.body.className = ""; // Clear existing classes

    if (condition.includes("clear")) {
        document.body.classList.add("sunny");
    } else if (condition.includes("cloud")) {
        document.body.classList.add("cloudy");
    } else if (condition.includes("rain")) {
        document.body.classList.add("rainy");
    } else if (condition.includes("thunderstorm")) {
        document.body.classList.add("thunderstorm");
    } else if (condition.includes("snow")) {
        document.body.classList.add("snow");
    } else if (condition.includes("mist") || condition.includes("fog")) {
        document.body.classList.add("mist");
    } else if (condition.includes("wind")) {
        document.body.classList.add("windy");
    } else {
        document.body.classList.add("default-weather");
    }
}
