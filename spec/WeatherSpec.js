describe("Weather", function() {
  var weatherComponent;


  beforeEach(function() {
    weatherComponent = new WeatherComponent();
  });


  it("should parse one row/day of data", function() {

    var input = {"dt":1524787200,"main":{"temp":8.23,"temp_min":8.23,"temp_max":8.23,"pressure":1014.18,"sea_level":1027.37,"grnd_level":1014.18,"humidity":89,"temp_kf":0},"weather":[{"id":500,"main":"Rain","description":"light rain","icon":"10n"}],"clouds":{"all":56},"wind":{"speed":4.56,"deg":254.503},"rain":{"3h":0.055199999999999},"sys":{"pod":"n"},"dt_txt":"2018-04-27 00:00:00"};
    var output = {"date":"27 Apr 2018","time":"00:00","day":"Friday","icon":"10n","description":"light rain","temp_range_C":"8 &deg;C","temp_range_F":"47 &deg;F","pressure":1014,"humidity":89,"wind_speed":4.56};

    expect(weatherComponent.prepareOneRow(input)).toEqual(output);
  });



  it("should convert linux timestamp to object", function() {
    var expectResult = {date: "26 Apr 2018", day: "Thursday", time: "21:00"};
    var timestamp = "1524776400";
    var stringDateTime = "2018-04-26 21:00:00";
    expect(weatherComponent._timeConverter(timestamp,stringDateTime)).toEqual(expectResult);
  });


});
