var CronJob = require('cron').CronJob;
var request = require('request');
var cheerio = require('cheerio');
var excelbuilder = require('msexcel-builder');

// install node.js 
// install npm install cron 
// install npm install cheerio 
// install npm install msexcel-builder

// ERRORS:::

// need to append to existing fil and have a for loop to find if its empty 

// TypeError: Cannot read property 'London, United Kingdom' of undefined

//node cron that run every day cron exmple 

var job = new CronJob({
	cronTime: '00 00 00 * * 1-7',
	//runs everyday at 00:00:00 AM
	onTick: function() {

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
			var workbook = excelbuilder.createWorkbook('./','test.xlsx');
			// create workbook at current directory (terminal)
			var sheet1 = workbook.createSheet('sheet1',10, 10);
			sheet1.set(date, currentLocation, todayhigh, todaylow, humidity, precipitationToday);
			// type error exist for json as shown above 
			workbook.save(function(err){
 				console.log('workbook saved ' + (err?'failed':'ok'));
			});
			console.log(metadata);
			}
		});
	}
});
	},
	start:false,
	timeZone: "United_Kingdom/London"
	// Improvement ways to detect geolocation base on geo tag for automated version 
});
job.start();



/*request('https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22london%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys', 
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
			var workbook = excelbuilder.createWorkbook('./','test.xlsx');
			// create workbook at current directory 
			var sheet1 = workbook.createSheet('sheet1',10, 10);
			sheet1.set(date, currentLocation, todayhigh, todaylow, humidity, precipitationToday);
			// type error exist for json 
			workbook.save(function(err){
 				console.log('workbook saved ' + (err?'failed':'ok'));
			});
			console.log(metadata);
			}
		});
	}
});*/

