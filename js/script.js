
var apiKey = '6361c00505f4a5a67e68aadadbb5143d';
var city = 'London';

$.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`)
.then (function (currentData) {
    var lon = currentData.coord.lon;
    var lat = currentData.coord.lat;

    console.log(currentData);

    console.log(`
    _____Current Conditions_____
    Temp: ${Math.round(currentData.main.temp)} C°
    Wind: ${currentData.wind.speed}m/s
    Humidity: ${currentData.main.humidity}%
    `)

    return $.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&units=metric&lon=${lon}&appid=${apiKey}`)
    .then (function (forecastData) {
        console.log(forecastData);
    })
});
