
var apiKey = '6361c00505f4a5a67e68aadadbb5143d';
var searchInput = document.querySelector('#search-input');
var searchButton = document.querySelector('#search-button');
var searchHistory = document.querySelector('#history')
var displayText = document.querySelector('#display-text');
var todaySection = document.querySelector('#today');
var forecastSection = document.querySelector('#forecast');
var forecastTitle = document.querySelector('#forecastTitle');
var currentDate = moment().format('DD/MM/YYYY');


function init() {
    searchButton.addEventListener('click', displayWeather);
    retrieveFromLocalStorage();
}

function saveToLocalStorage(searchItem) {
    var cities = [];
    cities.push(searchItem);
    localStorage.setItem("city", cities);
}

function retrieveFromLocalStorage() {
    var lastSearchedItem = localStorage.getItem('city');
    if (lastSearchedItem != null) {
        searchHistory.insertAdjacentHTML('beforeend', `
            <div id="searchHistoryItem">
                <p>${lastSearchedItem}</p>
            </div>`)
    }
}

function displayWeather() {
    // todaySection.innerHTML('');
    // forecastTitle.innerHTML('');
    // forecastSection.innerHTML('');

    var city = searchInput.value.toLowerCase().trim();
    var cityHistory = city.toUpperCase()
    $.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`)
        .then(function (currentData) {
            var lon = currentData.coord.lon;
            var lat = currentData.coord.lat;
            var iconURL = `https://openweathermap.org/img/w/${currentData.weather[0].icon}.png`;
            var displayCity = currentData.name;

            todaySection.insertAdjacentHTML('beforeend', `
                <div id="today-weather-card">
                    <div>
                        <h4>${displayCity} (${currentDate})</h4>
                        <img src="${iconURL}" alt="Weather Icon">
                    </div>
                    <p>Temp: ${Math.round(currentData.main.temp)} C°</p>
                    <p>Wind: ${currentData.wind.speed}m/s</p>
                    <p>Humidity: ${currentData.main.humidity}%</p>
                </div>
                `);

            return $.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&units=metric&lon=${lon}&appid=${apiKey}`)
                .then(function (forecastData) {
                    forecastTitle.innerHTML = '5-Day Forecast:';
                    // console.log(forecastData);

                    for (const item of forecastData.list) {
                        if (item.dt_txt.includes("12:00:00")) {
                            const date = moment.unix(item.dt).format("DD/MM/YYYY");
                            var iconURL = `https://openweathermap.org/img/w/${item.weather[0].icon}.png`;
                                forecastSection.insertAdjacentHTML('beforeend', `
                                <div class="weather-card">
                                    <div>
                                        <h4>${date}</h4>
                                        <img src="${iconURL}" alt="Weather Icon">
                                    </div>
                                    <p>Temp: ${Math.round(item.main.temp)} C°</p>
                                    <p>Wind: ${item.wind.speed}m/s</p>
                                    <p>Humidity: ${item.main.humidity}%</p>
                                </div>
                                `)
                            }
                        }
                });
            });

            searchHistory.insertAdjacentHTML('beforeend', `
            <div id="searchHistoryItem">
                <p>${cityHistory}</p>
            </div>`)
            saveToLocalStorage(cityHistory);
    }

init();

