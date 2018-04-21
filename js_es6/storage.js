class Storage {
  constructor(app_name) {
    this.app_name = app_name;
  }

  checkData() {
    if ((localStorage.getItem(this.app_name+"_saved_lat") === null) || (localStorage.getItem(this.app_name+"_saved_lat") === null) ) {
        return false;
    }    
    return true;
  }


  getData(data) {
    if ((localStorage.getItem(this.app_name+"_saved_lat") == null)
       || (localStorage.getItem(this.app_name+"_saved_lng") == null)) {
          localStorage.setItem(this.app_name+"_saved_lat", DEFAULT_LAT);
          localStorage.setItem(this.app_name+"_saved_lng", DEFAULT_LNG);
    }

    if (localStorage.getItem(this.app_name+"_saved_lng") == null) {
      localStorage.setItem(this.app_name+"_saved_lat", data.lat);
      localStorage.setItem(this.app_name+"_saved_lng", data.lng);
    }

    var ret = {saved_lat: localStorage.getItem(this.app_name+"_saved_lat"), saved_lng: localStorage.getItem(this.app_name+"_saved_lng") };
    return ret;
  }

  setData(data) {
    console.log('save data to storage');
    if (('lat' in data) &&  ('lng' in data)) {
      localStorage.setItem(this.app_name+"_saved_lat", data.lat);
      localStorage.setItem(this.app_name+"_saved_lng", data.lng);
    }
    else {
       throw "wrong parameters in setData().";
    }
  }
}

