var demo = false,
	zip = '15224',
	unit = 'f';

var isDemo = {
	init : function() {
		$('.weather .icon').removeClass('loading').attr('data-icon', 'd');
		$('.weather .temp').text('98°');
	}
},
date = {
	str  : function() {
		var curr = new Date(),
			day = curr.getDate(),
		    wday = curr.getDay(),
		    wdayArr = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
		    month = curr.getMonth(),
			monthArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
			date = [wdayArr[wday], monthArr[month], day];
		return date;
	},
	init : function(e) {
		$(e).find('span').text(date.str()[0] + ', ' + date.str()[1] + ' ' + date.str()[2]);
	}
},
time = {
	str : function() {
		var now = new Date (),
			hour = now.getHours(),
			min = now.getMinutes(),
			time = [];

		// Convert the hours component to 12-hour format if needed
		hour = ( hour > 12 ) ? hour - 12 : hour;

		// Add leading zero to minutes
		min = ( min < 10 ? "0" : "" ) + min;

		// Convert an hours component of "0" to "12"
		hour = ( hour == 0 ) ? 12 : hour;

		time = [hour, min];
		// Compose the string for display
		return time; 
	},
	init : function(e) {
		// var time = time.str();
		$(e).find('.hour').text(time.str()[0]);
		$(e).find('.min').text(time.str()[1]);
	}
},
yqlWeather = function(data, callback) {
	var fetch,
		url = 'http://query.yahooapis.com/v1/public/yql?format=json&diagnostics=true&callback=?&q=';

	if (data.zip !== '') {
		url += 'select * from weather.forecast where location in ("' + data.zip + '") and u="' + data.unit + '"';
	} else {
		console.log('Invalid location');
	}

	fetch = $.ajax({
	    url: url,
	    dataType: 'jsonp',
	    jsonp: 'callback',
	    jsonpCallback: 'cbfunc',
	    success: callback
	});

	return fetch;
},
weather = function(userSettings) {
	var defaults = {
		zip     : '17815',
	    unit    : 'f'
	},
	settings = $.extend(defaults, userSettings),
	icons = {
		0	 : 'a', // tornado
		1	 : 'a', // tropical_storm
		2	 : 'm', // hurricane
		3	 : 'i', // severe_thunderstorms
		4	 : 'i', // thunderstorms
		5	 : 'o', // mixed_rain_and_snow
		6	 : 'p', // mixed_rain_and_sleet
		7	 : 'p', // mixed_snow_and_sleet
		8	 : 'j', // freezing drizzle
		9	 : 'j', // drizzle
		10	 : 'k', // freezing_rain
		11	 : 'k', // showers
		12	 : 'k', // showers
		13	 : 'n', // snow_flurries
		14	 : 'n', // light_snow_showers
		15	 : 'o', // blowing_snow
		16	 : 'o', // snow
		17	 : 'p', // hail
		18	 : 'p', // sleet
		19	 : 'c', // dust
		20	 : 'c', // foggy
		21	 : 'c', // haze
		22	 : 'c', // smoky
		23	 : 'a', // blustery
		24	 : 'a', // windy
		25	 : 'b', // cold
		26	 : 'h', // cloudy
		27	 : 'g', // cloudy_mostly_n
		28	 : 'f', // cloudy_mostly_d
		29	 : 'g', // cloudy_partly_n
		30	 : 'f', // cloudy_partly_d
		31	 : 'e', // clear_n
		32	 : 'd', // sunny
		33	 : 'g', // fair_n
		34	 : 'f', // fair_d
		35	 : 'p', // mixed_rain_and_hail
		36	 : 'd', // hot
		37	 : 'i', // isolated_thunderstorms
		38	 : 'i', // scattered_thunderstorms
		39	 : 'i', // scattered_thunderstorms
		40	 : 'k', // scattered_showers
		41	 : 'o', // heavy_snow
		42	 : 'o', // scattered_snow_showers
		43	 : 'o', // heavy_snow
		44	 : 'h', // partly_cloudy
		45	 : 'k', // thundershowers
		46	 : 'o', // snow_showers
		47	 : 'k', // isolated_thundershowers
		3200 : 't', // not_available
	},
	process = function(settings, data) {

		var weather = data.query.results.channel.item.condition,
			weatherData = [];

		if(weather == null) {
			console.log('Error retrieving data');
			return;
		}
		
		weatherData.tempC = weather['temp'];
		weatherData.tempF = weatherData.tempC; // why?
		weatherData.code = weather['code'];

		return weatherData;
		
	};
	yqlWeather(settings, function(data) {
		var weather = process(settings, data);
		$('.weather .icon').removeClass('loading').attr('data-icon', icons[weather.code]);
		$('.weather .temp').text(function(){
			if(settings.unit == 'c') {
				return weather.tempC + '°';
			} else {
				return weather.tempF + '°';
			}
		});
	});
}


$(function(){
	date.init('.date');
	time.init('.clock');
	setInterval(function(){
		date.init('.date');
		time.init('.clock');
	}, 1000);
	
	if(demo == true) {
		isDemo.init();
	} else {
		weather({
			zip: zip,
			unit: unit
		});
	}
});