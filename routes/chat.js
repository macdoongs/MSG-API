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

conn.connect();

var sh_timer = require('./timer');

/* GET home page. */
router.get(['/', '/:id'], function(req, res, next) {
	var topicId = req.params.id;
  var myName = config.rds.user;
	var topicSeq = null;
	var mqtt_client = config.iot.mqttproxy;

	url = 'http://localhost:7579/mobius-yt/Sajouiot01/beacon01?rcn=4&lim=5'
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
			console.log('Mobius request Ok!');
			//console.log(body);

			}
		});

				var message = topicId;

				res.render('chat', { title: 'Ajou IoT', id:topicId , message : message});

});
//
 global.subCount = 0;

var roomId = "test-topic";
var req_topic = util.format('%s', roomId);
var mqtt_client = mqtt.connect('mqtt://' + config.iot.mqttproxy);


module.exports = router;
