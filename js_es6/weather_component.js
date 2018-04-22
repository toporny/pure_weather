class WeatherComponent {
  constructor(storage) {
    this.url = WEATHER_API_URL;
    this.storage = storage;

    let div1 = document.createElement('div');
    div1.setAttribute("id", "component_screen");
    document.body.appendChild(div1);

    let div2 = document.createElement('div');
    div2.setAttribute("id", "component_header");
    div1.appendChild(div2);

    let div3 = document.createElement('div');
    div3.setAttribute("id", "component_content");
    div1.appendChild(div3);

    let html = `<h1>loading...</h1>
                <a href="#" id="back_button">change area..</a>
                <div id="temp_changer"><span class="deg_C"> &deg;C</span> | <span class="deg_F"> &deg;F</span></div>
        `
    document.getElementById("component_header").innerHTML = html;
    //var tc = document.getElementById("temp_changer");
    document.getElementById("temp_changer").addEventListener("click", (e) => { this.changeTemperature(e); });
    document.getElementById("back_button").addEventListener("click", (e) => { this.hideWeatherView(e); });
  }


  hideWeatherView(evt) {
    // change city name to: loading
    // remove alle positions with day weather
     var cs = document.getElementById("component_screen");
     cs.style.display = "none";
  }


  changeTemperature(evt) {

    var deg_C = document.querySelector("#temp_changer > span.deg_C");
    var deg_F = document.querySelector("#temp_changer > span.deg_F");

    var day_C = document.querySelectorAll("div.day_info > p.temp_c");
    var day_F = document.querySelectorAll("div.day_info > p.temp_f");

    var index = 0, length = day_C.length;

    if (day_C[0].style.display == 'none') {
      for ( ; index < length; index++) {
          day_C[index].style.display = "block";
          day_F[index].style.display = "none";
      }
      deg_C.style.color = "#FFF";
      deg_F.style.color = "#AAA";
    }
    else {
      for ( ; index < length; index++) {
          day_C[index].style.display = "none";
          day_F[index].style.display = "block";
      }
      deg_C.style.color = "#AAA";
      deg_F.style.color = "#FFF";
    }
  }


  _timeConverter(UNIX_timestamp, dt_txt){
    let a = new Date(UNIX_timestamp * 1000);
    let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    let days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

    let time = {
      date: ('0'+a.getDate()).slice(-2) + ' ' + months[a.getMonth()] + ' ' + a.getFullYear(),
      day: days[a.getDay()],
      time: dt_txt.slice(-8).substr(0, 5)
    };
    //console.log(time);
    return time;
  }


  showResults(data) {

    console.log(data);
    var html = `
        <div class="icon_row">`
    
    for (let i=0; i<40; i=i+8) {

        let date_time = self._timeConverter(data.list[i].dt, data.list[i].dt_txt);
        let min_temp = Math.round(parseFloat(data.list[i].main.temp_min));
        let max_temp = Math.round(parseFloat(data.list[i].main.temp_max));

        var range_c;

        if (min_temp  == max_temp) {
          range_c = min_temp+' &deg;C'; 
        } else {
          var range_c =  min_temp + ' &deg;C - ' + max_temp + ' &deg;C'; 
        }

        if (min_temp == max_temp) {
          var range_f = Math.round(1.8*parseFloat(data.list[i].main.temp_min)+32)+' &deg;F'; 
        } else {
          var range_f = Math.round(1.8*parseFloat(data.list[i].main.temp_min)+32) + ' &deg;F - ' + Math.round(1.8*parseFloat(data.list[i].main.temp_max)+32)+' &deg;F'; 
        }

        let wd = {
            date : date_time.date,
            time : date_time.time,
            day : date_time.day,
            icon : data.list[i].weather[0].icon,
            description : data.list[i].weather[0].description,
            temp_range_C : range_c, // celcius range
            temp_range_F : range_f, // fahrenheit range
            pressure :   Math.round(parseFloat(data.list[i].main.pressure)),
            humidity : data.list[i].main.humidity,
            wind_speed : data.list[i].wind.speed
        }


        html += `
        <div class="day_info"><p class="day">${wd.date}<br>${wd.day}</p>
            <img class="icon" src="assets/icons/${wd.icon}.png">
            <p class="temp_c">${wd.temp_range_C}</p>
            <p class="temp_f">${wd.temp_range_F}</p>
            <p class="pressure">pressure: ${wd.pressure} kPa</p>
            <p class="wind">wind: ${wd.wind_speed} km/h</p>
            <p class="humidity">humidity: ${wd.humidity} </p>
        </div>
        `            
    }

    html += `</div>`

    document.getElementById("component_content").innerHTML = html;

    console.log(data.city.name);
    var city_name = document.querySelector("h1");
    if (data.city.name !== undefined) {
      city_name.innerHTML = data.city.name;
    } else {
      city_name.innerHTML = '';
    }
  
  }

  showError(data) {
    var city_name = document.querySelector("h1");
    city_name.innerHTML = "problem with getting data";
    document.getElementById("component_content").innerHTML = '';
  }


  fetchData(url) {
    self = this;
    fetch(url, {
        method: 'GET',
        redirect: 'follow',
    })
    .then(response => response.json())
    .then(function (data){
        self.showResults(data);
    })
    .catch(function(e) {
        self.showError();
        console.log(e);
        console.log('error with http request');
    })

    console.log('getData');
  }


  getDefaultData() {
    // prepare URL
    var url = this.url;
    if (this.storage.checkData()) {
      console.log('get stored data');
      let cords = this.storage.getData();
      url += "&lat=" + cords.saved_lat;
      url += "&lon=" + cords.saved_lng;
    }
    else {
      console.log('get default data');
      url += "&lat=" + DEFAULT_LAT;
      url += "&lon=" + DEFAULT_LNG;
      this.storage.setData({lat: DEFAULT_LAT, lng: DEFAULT_LNG});
    }
    url += "&appid=" + WEATHER_API_KEY;
    // get weather data
    this.fetchData(url);
  }


  getBaloonBasedData(txtLat, txtLng) {
    document.querySelector("h1").innerHTML = 'Loading...';
    document.getElementById("component_content").innerHTML = '';

    this.storage.setData({lat:txtLat, lng:txtLng});
    var url = this.url;
    url += "&lat=" + txtLat;
    url += "&lon=" + txtLng;
    url += "&appid=" + WEATHER_API_KEY;
    this.fetchData(url);
  }


}
