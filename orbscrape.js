var CronJob = require('cron').CronJob;
var request = require('request');
// var cheerio = require('cheerio');
var excelbuilder = require('msexcel-builder');


// ERRORS:::

// need to append to existing fil and have a for loop to find if its empty 


/*


Manipulating with cell npm install xlsx

Opening / writing file 
if(typeof require !== 'undefined') XLSX = require('xlsx')
var workbook = XLSX.readFile('filename.xlsx');

XLSX.write(wb, 'filename.xlsx')

XLS.utils
cell adreess as {c:c, r:R} C = colum, R = Row 
example B5 = {c:1, r:4}

cell range objects = {s:s, e:E} s first cell, e last cell 
example range A3:B7 = {s:{c:0, r:2}, e:{c:1, r:6}}
for(var R = range.s.r; R <= range.e.r; ++R) {
  for(var C = range.s.c; C <= range.e.c; ++C) {
    var cell_address = {c:C, r:R};
  }
}

if value = NULl then input data stream 
*/
//node cron that run every day cron exmple 

var getWeather = function () {
	request('https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22london%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys', 
	function(error, response, html) {
		if(!error && response.statusCode == 200) {
		var file = JSON.parse(html);
	    var forecastArray = file.query.results.channel.item.forecast;
		var date = forecastArray[0].date;
		//var currentLocation = file.query.results.channel.location.city;
		//var humidity = file.query.results.channel.atmosphere.humidity;
		var todayhigh = forecastArray[0].high;
		var todaylow = forecastArray[0].low;
		request('http://api.wunderground.com/api/1a5e2f0daefbe025/geolookup/conditions/q/United_Kingdom/London.json', 
			function(error, response, html) {
			if(!error && response.statusCode == 200) {
				var file = JSON.parse(html);
				var currentLocation = file.current_observation.display_location.full;
				//var currentTemerature = file.current_observation.temp_c;
				var humidity = file.current_observation.relative_humidity;
				var precipitationToday = file.current_observation.precip_today_metric;
				var metadata = {
					date: date,
					geoLocation: currentLocation,
					high: todayhigh,
					low: todaylow,
					Humidity: humidity,
					Precipitation: precipitationToday
				};
				// TODO: open workbook if file already exists
				var workbook = excelbuilder.createWorkbook('./','test.xlsx');
				// create workbook at current directory (terminal)
				var sheet1 = workbook.createSheet('sheet1',10, 10);
				// TODO: update header row

				// otherwise
				// TODO: read last row number from sheet1
				var row = 1;
				var col = 1;
				for (var field in metadata) {
					sheet1.set(col, row, metadata[field]);
					col++;
				}
				// type error exist for json as shown above 
				workbook.save(function(err){
					console.log('workbook saved ' + (err?'failed':'ok'));
				});
				console.log(metadata);
				}
			});
		}
	});
};

getWeather();

var job = new CronJob({
	// cronTime: '00 00 00 * * 1-7',
	cronTime: '1 0 * * *',
	//runs everyday at 00:00:00 AM
	onTick: getWeather,
	start: false,
	timeZone: "Europe/London"
	// Improvement ways to detect geolocation base on geo tag for automated version 
});
