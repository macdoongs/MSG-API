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

conn.connect();

var sh_timer = require('./timer');

/* GET home page. */
router.get(['/', '/:id'], function(req, res, next) {
  var myName = config.rds.user;
	var topicId = "test-topic";
	var topicSeq = null;
	var mqtt_client = config.iot.mqttproxy;


				//var message = mqtt_req_connect(mqtt_client);

				var message = "room01";

				res.render('chat', { title: 'Ajou IoT', id:topicId , message : message});

});
//
 global.subCount = 0;

var roomId = "test-topic";
var req_topic = util.format('%s', roomId);
var mqtt_client = mqtt.connect('mqtt://' + config.iot.mqttproxy);


module.exports = router;
