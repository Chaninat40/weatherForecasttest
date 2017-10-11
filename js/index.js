$(document).ready(function () {
  var lat = 0;
  var lon = 0;
  var suffix = "°C"
  var inputCity;
  var mode = "coords";
  var datetime = "";
  var dateCount = 0;
  var dateElement = "";
  var forecastDayTemp = 0;
  var forecastDayCount = 0;
  var APIKEY = "a5f643711b1b904eb04e440232b395b8";
  var URL = "http://api.openweathermap.org/data/2.5/weather?";
  var imgsrc = "http://openweathermap.org/img/w/"
  var data;
  function getWeather(input, mode) {
    var xhr = new XMLHttpRequest();
    var forecast = new XMLHttpRequest();
    if (mode == "city") {
      xhr.open("GET", "http://api.openweathermap.org/data/2.5/weather?q=" + input + "&units=metric&APPID=" + APIKEY, false);
      xhr.send();
      forecast.open("GET", "http://api.openweathermap.org/data/2.5/forecast?q=" + input + "&units=metric&APPID=" + APIKEY, false);
      forecast.send();
      $.ajax({
        url: "http://api.openweathermap.org/data/2.5/forecast?q=" + input + "&units=metric&APPID=" + APIKEY,
        dataType: "jsonp",
        statusCode: {
          404: function () {
            // alert('page not found');
            var row = '<div class="container">';
            row += '<div class="alert alert-danger">';
            row += '<strong>Danger!</strong> You should <a href="#" class="alert-link">read this message</a>.';
            row += '</div>';
            row += '</div>';
            $("#data2").append(row);
          }
        }
      });
    } else if (mode == "coords") {
      xhr.open("GET", "http://api.openweathermap.org/data/2.5/weather?lat=" + input[0] + "&lon=" + input[1] + "&units=metric&APPID=" + APIKEY, false);
      xhr.send();
      forecast.open("GET", "http://api.openweathermap.org/data/2.5/forecast?lat=" + input[0] + "&lon=" + input[1] + "&units=metric&APPID=" + APIKEY, false);
      forecast.send();
      $.ajax({
        url: "http://api.openweathermap.org/data/2.5/forecast?lat=" + input[0] + "&lon=" + input[1] + "&units=metric&APPID=" + APIKEY,
        dataType: "jsonp",
        statusCode: {
          404: function () {
            // alert('page not found');
            var row = '<div class="container">';
            row += '<div class="alert alert-danger">';
            row += '<strong>Danger!</strong> You should <a href="#" class="alert-link">read this message</a>.';
            row += '</div>';
            row += '</div>';
            $("#data2").append(row);
          }
        }
      });
    }
    data = JSON.parse(xhr.response);
    updateDisplay(data);
    updateForecast(JSON.parse(forecast.response));
  }

  function updateDisplay(city) {
    var html = "";
    $("#location").text(city.name);
    $("#curr-temp").text(Math.floor(city.main.temp) + suffix);
    $("#curr-description").text(city.weather[0].description);
    if (city.weather[0].description == "clear sky") {
      var img = new Image();
      img.onload = function () {
        // $('body').css({'background':'#000'});
        $('body').css({
          'background-image': 'url("' + img.src + '")'
        });
      };
      img.src = 'images/clear_sky.jpg';
    }
    if (city.weather[0].description) {
      $('body').css({
        'background-image': 'url("images/sunset.jpg")'
      });
    }
    console.log(city.weather[0].description);
    $("#curr-humidity").text(city.main.humidity + "%");
    $("#curr-pressure").text(city.main.pressure + "millibar");
    $("#curr-speed").text(city.wind.speed + "m/s");
    html += imgsrc + city.weather[0].icon + ".png";
    document.getElementById("curr-icon").src = html;
  }

  function updateForecast(days) {
    datetime = 0;
    dateCount = 0;
    var iconHTML = ""
    for (var i = 0; i < days.list.length; i++) {
      if (days.list[i].dt_txt.slice(0, 10) != datetime) {
        forecastDayTemp = 0;
        forecastDayCount = 0;
        dateCount++;
        datetime = days.list[i].dt_txt.slice(0, 10);
        dateElement = "#day" + dateCount + "-date";
        $(dateElement).text(getDay(datetime));
        for (var j = 0; j < days.list.length; j++) {
          if (datetime == days.list[j].dt_txt.slice(0, 10)) {
            forecastDayTemp += days.list[j].main.temp;
            forecastDayCount++;
          }
        }
        forecastDayTemp = Math.floor(forecastDayTemp / forecastDayCount);
        $("#day" + dateCount + "-temp").text(forecastDayTemp + suffix);
        $("#day" + dateCount + "-description").text(days.list[i].weather[0].description);
        iconHTML = imgsrc + days.list[i].weather[0].icon + ".png";
        document.getElementById("day" + dateCount + "-icon").src = iconHTML;
      }
    }
  }

  function getDay(dateString) {
    var week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return week[new Date(dateString).getDay()];
  }

  function getTempFormat(input, degree) {
    if (degree == "°F") {
      return Math.ceil((input * 1.8) + 32);
    }
    if (degree == "°C") {
      return Math.floor((input - 32) * (5.0 / 9.0));
    }
  }

  $("#cel").css("font-weight", "bold");

  $("#temp-control").click(function () {
    var temp;
    if (suffix == "°C") {
      suffix = "°F";
      $("#cel").css("font-weight", "normal");
      $("#far").css("font-weight", "bold");
    } else if (suffix == "°F") {
      suffix = "°C";
      $("#cel").css("font-weight", "bold");
      $("#far").css("font-weight", "normal");
    }
    temp = getTempFormat($("#curr-temp").text().split("°")[0], suffix);
    $("#curr-temp").text(temp + suffix);
    for (dateCount = 1; dateCount < 6; dateCount++) {
      temp = getTempFormat($("#day" + dateCount + "-temp").text().split("°")[0], suffix);
      $("#day" + dateCount + "-temp").text(temp + suffix);
    }

  })

  $("#search-btn").click(function () {
    mode = "city";
    inputCity = document.getElementById("city-input").value;
    getWeather(inputCity, mode);
  }) 

  getWeather("Phuket , Thailand", "city");
});