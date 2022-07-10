var getGeo = function (city) {
  var apiUrl =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    city +
    "&limit=1&appid=6faa5e3c233b64674f23b79cff53f5b6";
  console.log(apiUrl);
  fetch(apiUrl).then(function (response) {
    response.json().then(function (data) {
      var city = data[0].name;
      getWeather(data[0].lat, data[0].lon, city);
    });
  });
};
var getWeather = function (lat, lon, city) {
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat +
    "&lon=" +
    lon +
    "&exclude=hourly,minutely,alert&units=imperial&appid=6faa5e3c233b64674f23b79cff53f5b6";

  fetch(apiUrl).then(function (response) {
    response.json().then(function (data) {
      console.log(data);
      displayWeather(data, city);
    });
  });
};
var displayWeather = function (data, city) {
  var date = new Date(data.current.dt * 1000);
  $("#city-name").text(city);
  $("#today-date").text(date.toLocaleDateString("en-US"));
  $("#icon-0").html(iconGetter(data.current.weather[0].main));
  $("#temp-0").text(data.current.temp + "F");
  $("#wind-0").text(data.current.wind_speed + "MPH");
  $("#hum-0").text(data.current.humidity + "%");
  $("#uv-0").text(data.current.uvi);
};
var formSubmitHanlder = function (event) {
  event.preventDefault();
  var city = $("input").val().trim();
  if (city) {
    getGeo(city);
  } else {
    alert("please enter a city name!");
  }
  $("input").val("");
};
var iconGetter = function (weather) {
  switch (weather) {
    case "Thunderstorm":
      return "&#127785";
      break;
    case "Drizzle":
      return "&#127782";
      break;
    case "Rain":
      return "&#127783";
      break;
    case "Snow":
      return "&#10052";
      break;
    case "Clear":
      return "&#9728";
      break;
    case "Clouds":
      return "&#9729";
      break;
  }
};

$(".search").on("submit", formSubmitHanlder);
