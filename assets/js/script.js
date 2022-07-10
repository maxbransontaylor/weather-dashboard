var savedButtons = "";
//load local storage items on page reload
var loadButtons = function () {
  var cities = JSON.parse(localStorage.getItem("buttons"));
  if (cities) {
    savedButtons = cities;
    for (var i = 0; i < savedButtons.length; i++) {
      makeBtn(savedButtons[i], true);
    }
  } else {
    savedButtons = [];
  }
};
//converts city name into coordinates, passes city name
var getGeo = function (city) {
  var apiUrl =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    city +
    "&limit=1&appid=6faa5e3c233b64674f23b79cff53f5b6";

  fetch(apiUrl)
    .then(function (response) {
      response.json().then(function (data) {
        if (data.length != 0) {
          console.log(data);
          var city = data[0].name;
          getWeather(data[0].lat, data[0].lon, city);
        } else {
          alert("Couldn't find a city with that name");
        }
      });
    })
    .catch(function (error) {
      alert("could not connect to server");
    });
};
//gets weather at coordinates, passes city name
var getWeather = function (lat, lon, city) {
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat +
    "&lon=" +
    lon +
    "&exclude=hourly,minutely,alert&units=imperial&appid=6faa5e3c233b64674f23b79cff53f5b6";

  fetch(apiUrl).then(function (response) {
    response.json().then(function (data) {
      localStorage.setItem(city, JSON.stringify(data));
      makeBtn(city, false);
      displayWeather(data, city);
    });
  });
};
//display weather for city with data, called by getWeather and cityButtonHandler
var displayWeather = function (data, city) {
  $("#forecast-container").removeClass("invisible").addClass("visible");
  var date = new Date(data.current.dt * 1000);
  $("#city-name").text(city);
  $("#today-date").text("(" + date.toLocaleDateString("en-US") + ")");
  $("#icon-0").html(iconGetter(data.current.weather[0].main));
  $("#temp-0").text(data.current.temp + "F");
  $("#wind-0").text(data.current.wind_speed + "MPH");
  $("#hum-0").text(data.current.humidity + "%");
  $("#uv-0").text(data.current.uvi);
  $("#uv-0").removeClass("bg-success bg-danger bg-warning");
  //color codes uv index
  if (data.current.uvi < 3) {
    $("#uv-0").addClass("bg-success");
  } else if (6 > data.current.uvi >= 3) {
    $("#uv-0").addClass("bg-warning");
  } else if (data.current.uvi >= 6) {
    $("#uv-0").addClass("bg-danger");
  } else {
    console.log("uv index missing");
  }
  //5 day forecast
  for (var i = 0; i < 5; i++) {
    var date = new Date(data.daily[i].dt * 1000);
    $("#date-" + (i + 1)).text(date.toLocaleDateString("en-US"));
    $("#icon-" + (i + 1)).html(iconGetter(data.daily[i].weather[0].main));
    $("#temp-" + (i + 1)).text(data.daily[i].temp.day + "F");
    $("#wind-" + (i + 1)).text(data.daily[i].wind_speed + "MPH");
    $("#hum-" + (i + 1)).text(data.daily[i].humidity + "%");
  }
};
var makeBtn = function (city, load) {
  var duplicate = false;
  //check if a button already exists
  $(".history-button").each(function () {
    if (city == $(this).text().trim()) {
      duplicate = true;
    }
  });
  if (!duplicate) {
    var newBtn = $("<p>")
      .addClass("btn btn-secondary history-button col-12 mt-1")
      .text(city);
    $(".history").append(newBtn);
    //load argument stops same items from being repeatedly added to local storage
    if (!load) {
      savedButtons.push(city);
      localStorage.setItem("buttons", JSON.stringify(savedButtons));
    }
  }
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
//loads saved data for a city, then calls getGeo to check for updates
var cityButtonHandler = function (event) {
  var city = $(this).text();
  var data = JSON.parse(localStorage.getItem(city));
  displayWeather(data, city);
  getGeo(city);
};
//iconGetter- getter of icons
var iconGetter = function (weather) {
  switch (weather) {
    case "Thunderstorm":
      return "&#127785";
    case "Drizzle":
      return "&#127782";
    case "Rain":
      return "&#127783";
    case "Snow":
      return "&#10052";
    case "Clear":
      return "&#9728";
    case "Clouds":
      return "&#9729";
  }
};

$(".search").on("submit", formSubmitHanlder);
$(".history").on("click", ".history-button", cityButtonHandler);
loadButtons();
