var express = require('express');
var router = express.Router();
var config = require('config.json')('./config/config.json');

var mysql = require('mysql');

var conn = mysql.createConnection({
	host      : config.rds.host,
	user      : config.rds.user,
	password  : config.rds.password,
	database  : config.rds.msgdatabase
});

conn.connect();

var request = require('request');

var xml2js = require('xml2js');
var parser = new xml2js.Parser();

var mqtt = require('mqtt');
var mqtt_client = mqtt.connect('mqtt://' + config.iot.mqttproxy);


mqtt_client.on('connect', function () {
		console.log("MQTT Connect");
});

mqtt_client.on('message', function (topic, data) {
		console.log('message : ' + data);
});

// unsubscribe topic
router.post(['/'], function(req, res, next){
		var topic = req.body.topic;
		mqtt_client.subscribe(topic);
		
		res.send("OK");
});

// subscribe topic
router.get(['/:topic'], function(req, res, next) {
		var topic = req.params.topic;
		mqtt_client.unsubscribe(topic);

		res.send("OK");
});


module.exports = router;
