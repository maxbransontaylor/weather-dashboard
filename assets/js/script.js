var getGeo = function (city) {
  var apiUrl =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    city +
    "&limit=1&appid=6faa5e3c233b64674f23b79cff53f5b6";
  fetch(apiUrl).then(function (response) {
    response.json().then(function (data) {
      getWeather(data[0].lat, data[0].lon);
    });
  });
};
var getWeather = function (lat, lon) {
  var apiUrl =
    "https://api.openweathermap.org/data/3.0/onecall?lat=" +
    lat +
    "&lon=" +
    lon +
    "&exclude=minutely,hourly,alerts&appid=6faa5e3c233b64674f23b79cff53f5b6";
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

$(".search").on("submit", formSubmitHanlder);
