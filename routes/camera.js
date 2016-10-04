var express = require('express');
var router = express.Router();
var config = require('config.json')('./config/config.json');

var util = require('util');

var mqtt = require('mqtt');

var mysql = require('mysql');
var conn = mysql.createConnection({
	host      : config.rds.host,
	user      : config.rds.user,
	password  : config.rds.password,
	database  : config.rds.iotdatabase
});

var request = require('request');

var xml2js = require('xml2js');
var parser = new xml2js.Parser();


var sh_timer = require('./timer');



/* GET home page. */
router.get(['/', '/:id'], function(req, res, next) {
  var myName = config.rds.user;
	var topicId = "test-topic";
	var topicSeq = null;
	var mqtt_client = config.iot.mqttproxy;

	url = 'http://localhost:7579/mobius-yt/Sajouiot03/camera?rcn=4&lim=1'
	request({
     		url : url,
     		method: 'GET',
     		headers : {
      			'Accept':'application/xml',
      			'X-M2M-RI': '12345',
      			'X-M2M-Origin': 'SOrigin',
						'nmtype':'short'    },
		//qs: {'query' : text}
   	}, function(error, response, body) {
    		if(error) {
      			console.log(error);
    		}else{

					parser.parseString(body, function(err, result) {
  					console.log(result);
						sResult = JSON.stringify(result);
						oResult = JSON.parse(sResult);

						var cin = oResult['m2m:rsp']['m2m:cin'];
						var image = cin[0]['con'][0];



						res.writeHead(200, {'Content-type':'base64'});
						res.end(base64_decode(image));
					});

			}
		});
});

// function to create file from base64 encoded string
function base64_decode(base64str) {
    // create buffer object from base64 encoded string, it is important to tell the constructor that the string is base64 encoded
    var bitmap = new Buffer(base64str, 'base64');
    // write buffer to file

		return bitmap;
}


module.exports = router;
