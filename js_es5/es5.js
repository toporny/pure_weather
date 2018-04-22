var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Storage = function () {
  function Storage(app_name) {
    _classCallCheck(this, Storage);

    this.app_name = app_name;
  }

  _createClass(Storage, [{
    key: "checkData",
    value: function checkData() {
      if (localStorage.getItem(this.app_name + "_saved_lat") === null || localStorage.getItem(this.app_name + "_saved_lat") === null) {
        return false;
      }
      return true;
    }
  }, {
    key: "getData",
    value: function getData(data) {
      if (localStorage.getItem(this.app_name + "_saved_lat") == null || localStorage.getItem(this.app_name + "_saved_lng") == null) {
        localStorage.setItem(this.app_name + "_saved_lat", DEFAULT_LAT);
        localStorage.setItem(this.app_name + "_saved_lng", DEFAULT_LNG);
      }

      if (localStorage.getItem(this.app_name + "_saved_lng") == null) {
        localStorage.setItem(this.app_name + "_saved_lat", data.lat);
        localStorage.setItem(this.app_name + "_saved_lng", data.lng);
      }

      var ret = { saved_lat: localStorage.getItem(this.app_name + "_saved_lat"), saved_lng: localStorage.getItem(this.app_name + "_saved_lng") };
      return ret;
    }
  }, {
    key: "setData",
    value: function setData(data) {
      console.log('save data to storage');
      if ('lat' in data && 'lng' in data) {
        localStorage.setItem(this.app_name + "_saved_lat", data.lat);
        localStorage.setItem(this.app_name + "_saved_lng", data.lng);
      } else {
        throw "wrong parameters in setData().";
      }
    }
  }]);

  return Storage;
}();
var APP_ID = 'weather_app_201804191219';
var WEATHER_API_KEY = 'f68a8966b0f50c2dd81eaa8b9ceb063f';
var WEATHER_API_URL = 'http://api.openweathermap.org/data/2.5/forecast?units=metric';
var DEFAULT_LAT = 54.3561787;
var DEFAULT_LNG = 18.5609506;
var DEFAULT_CITY = 'Gdansk';
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WeatherComponent = function () {

  // component contructor
  function WeatherComponent(storage) {
    var _this = this;

    _classCallCheck(this, WeatherComponent);

    this.url = WEATHER_API_URL;
    this.storage = storage;

    var div1 = document.createElement('div');
    div1.setAttribute("id", "component_screen");
    document.body.appendChild(div1);

    var div2 = document.createElement('div');
    div2.setAttribute("id", "component_header");
    div1.appendChild(div2);

    var div3 = document.createElement('div');
    div3.setAttribute("id", "component_content");
    div1.appendChild(div3);

    var html = "<h1>loading...</h1>\n                <a href=\"#\" id=\"back_button\">change area..</a>\n                <div id=\"temp_changer\"><span class=\"deg_C\"> &deg;C</span> | <span class=\"deg_F\"> &deg;F</span></div>\n        ";
    document.getElementById("component_header").innerHTML = html;
    //var tc = document.getElementById("temp_changer");
    document.getElementById("temp_changer").addEventListener("click", function (e) {
      _this.changeTemperature(e);
    });
    document.getElementById("back_button").addEventListener("click", function (e) {
      _this.hideWeatherView(e);
    });
  }

  // hide result during refreshing data (and show: "loading")


  _createClass(WeatherComponent, [{
    key: "hideWeatherView",
    value: function hideWeatherView(evt) {
      // change city name to: loading
      // remove alle positions with day weather
      var cs = document.getElementById("component_screen");
      cs.style.display = "none";
    }

    // changeTemperature is launched when Celcius -> Fahrenheit button is clicked 

  }, {
    key: "changeTemperature",
    value: function changeTemperature(evt) {

      var deg_C = document.querySelector("#temp_changer > span.deg_C");
      var deg_F = document.querySelector("#temp_changer > span.deg_F");

      var day_C = document.querySelectorAll("div.day_info > p.temp_c");
      var day_F = document.querySelectorAll("div.day_info > p.temp_f");

      var index = 0,
          length = day_C.length;

      if (day_C[0].style.display == 'none') {
        for (; index < length; index++) {
          day_C[index].style.display = "block";
          day_F[index].style.display = "none";
        }
        deg_C.style.color = "#FFF";
        deg_F.style.color = "#AAA";
      } else {
        for (; index < length; index++) {
          day_C[index].style.display = "none";
          day_F[index].style.display = "block";
        }
        deg_C.style.color = "#AAA";
        deg_F.style.color = "#FFF";
      }
    }

    // _timeConverter from UNIX_timestamp to object

  }, {
    key: "_timeConverter",
    value: function _timeConverter(UNIX_timestamp, dt_txt) {
      var a = new Date(UNIX_timestamp * 1000);
      var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

      var time = {
        date: ('0' + a.getDate()).slice(-2) + ' ' + months[a.getMonth()] + ' ' + a.getFullYear(),
        day: days[a.getDay()],
        time: dt_txt.slice(-8).substr(0, 5)
      };
      return time;
    }

    // prepare one row or column (depends of screen)

  }, {
    key: "prepareOneRow",
    value: function prepareOneRow(obj) {
      var date_time = this._timeConverter(obj.dt, obj.dt_txt);
      var min_temp = Math.round(parseFloat(obj.main.temp_min));
      var max_temp = Math.round(parseFloat(obj.main.temp_max));

      var range_c;

      if (min_temp == max_temp) {
        range_c = min_temp + ' &deg;C';
      } else {
        var range_c = min_temp + ' &deg;C - ' + max_temp + ' &deg;C';
      }

      if (min_temp == max_temp) {
        var range_f = Math.round(1.8 * parseFloat(obj.main.temp_min) + 32) + ' &deg;F';
      } else {
        var range_f = Math.round(1.8 * parseFloat(obj.main.temp_min) + 32) + ' &deg;F - ' + Math.round(1.8 * parseFloat(obj.main.temp_max) + 32) + ' &deg;F';
      }

      var wd = {
        date: date_time.date,
        time: date_time.time,
        day: date_time.day,
        icon: obj.weather[0].icon,
        description: obj.weather[0].description,
        temp_range_C: range_c, // celcius range
        temp_range_F: range_f, // fahrenheit range
        pressure: Math.round(parseFloat(obj.main.pressure)),
        humidity: obj.main.humidity,
        wind_speed: obj.wind.speed
      };

      return wd;
    }

    // prepare html with results

  }, {
    key: "prepareHTML",
    value: function prepareHTML(data) {
      var html = "\n        <div class=\"icon_row\">";

      for (var i = 0; i < 40; i = i + 8) {
        var wd = this.prepareOneRow(data.list[i]);

        html += "\n        <div class=\"day_info\"><p class=\"day\">" + wd.date + "<br>" + wd.day + "</p>\n            <img class=\"icon\" src=\"assets/icons/" + wd.icon + ".png\">\n            <p class=\"temp_c\">" + wd.temp_range_C + "</p>\n            <p class=\"temp_f\">" + wd.temp_range_F + "</p>\n            <p class=\"pressure\">pressure: " + wd.pressure + " kPa</p>\n            <p class=\"wind\">wind: " + wd.wind_speed + " km/h</p>\n            <p class=\"humidity\">humidity: " + wd.humidity + " </p>\n        </div>\n        ";
      }

      html += "</div>";
      return html;
    }

    // show results in "component_content" div

  }, {
    key: "showResults",
    value: function showResults(data) {

      var generatedHTML = this.prepareHTML(data);

      document.getElementById("component_content").innerHTML = generatedHTML;

      console.log(data.city.name);
      var city_name = document.querySelector("h1");
      if (data.city.name !== undefined) {
        city_name.innerHTML = data.city.name;
      } else {
        city_name.innerHTML = '';
      }
    }
  }, {
    key: "showError",
    value: function showError(data) {
      var city_name = document.querySelector("h1");
      city_name.innerHTML = "problem with getting data";
      document.getElementById("component_content").innerHTML = '';
    }
  }, {
    key: "fetchData",
    value: function fetchData(url) {
      self = this;
      fetch(url, {
        method: 'GET',
        redirect: 'follow'
      }).then(function (response) {
        return response.json();
      }).then(function (data) {
        self.showResults(data);
      }).catch(function (e) {
        self.showError();
        console.log(e);
        console.log('error with http request');
      });

      console.log('getData');
    }

    // if no storage -> getDefaultData() 

  }, {
    key: "getDefaultData",
    value: function getDefaultData() {
      // prepare URL
      var url = this.url;
      if (this.storage.checkData()) {
        var cords = this.storage.getData();
        url += "&lat=" + cords.saved_lat;
        url += "&lon=" + cords.saved_lng;
      } else {
        url += "&lat=" + DEFAULT_LAT;
        url += "&lon=" + DEFAULT_LNG;
        this.storage.setData({ lat: DEFAULT_LAT, lng: DEFAULT_LNG });
      }
      url += "&appid=" + WEATHER_API_KEY;
      // get weather data
      this.fetchData(url);
    }

    // if google baloon was set

  }, {
    key: "getBaloonBasedData",
    value: function getBaloonBasedData(txtLat, txtLng) {
      document.querySelector("h1").innerHTML = 'Loading...';
      document.getElementById("component_content").innerHTML = '';

      this.storage.setData({ lat: txtLat, lng: txtLng });
      var url = this.url;
      url += "&lat=" + txtLat;
      url += "&lon=" + txtLng;
      url += "&appid=" + WEATHER_API_KEY;
      this.fetchData(url);
    }
  }]);

  return WeatherComponent;
}();
function initialize() {
    // Creating map object

    storage = new Storage(APP_ID);
    positionData = storage.getData();

    var map = new google.maps.Map(document.getElementById('google_map'), {
        zoom: 6,
        center: new google.maps.LatLng(positionData.saved_lat, positionData.saved_lng),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    // creates a draggable marker to the given coords
    var vMarker = new google.maps.Marker({
        position: new google.maps.LatLng(positionData.saved_lat, positionData.saved_lng),
        draggable: true,
        title: DEFAULT_CITY
    });

    var infowindow = new google.maps.InfoWindow({
        content: 'drag somewhere<br>to check weather'
    });

    infowindow.open(map, vMarker);

    weatherComponent = new WeatherComponent(storage);
    weatherComponent.getDefaultData();

    google.maps.event.addListener(vMarker, 'mousedown', function (evt) {
        infowindow.close();
    });

    // adds a listener to the marker
    // gets the coords when drag event ends
    // then updates the input with the new coords
    var timer;
    google.maps.event.addListener(vMarker, 'dragend', function (evt) {
        txtLat = evt.latLng.lat().toFixed(6);
        txtLng = evt.latLng.lng().toFixed(6);

        // console.log('txtLat, txtLng:',txtLat, txtLng);
        weatherComponent.getBaloonBasedData(txtLat, txtLng);

        if (typeof timer !== 'undefined') {
            console.log('delete timer');
            clearTimeout(timer);
        }

        timer = window.setTimeout(function () {

            document.getElementById('component_screen').style.display = 'block';
        }, 1500);

        map.panTo(evt.latLng);
    });

    // centers the map on markers coords
    map.setCenter(vMarker.position);

    // adds the marker on the City Namep
    vMarker.setMap(map);
}
