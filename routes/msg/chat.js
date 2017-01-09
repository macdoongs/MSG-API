var express = require('express');
var router = express.Router();
var config = require('config.json')('./config/config.json');

var request = require('request');

var xml2js = require('xml2js');
var parser = new xml2js.Parser();

var chat_model = require('../../models/msg/chat.model');


var mqtt = require('mqtt');
var mqtt_client = mqtt.connect('mqtt://' + config.iot.mqttproxy);

mqtt_client.on('connect', function () {
		console.log("MQTT Connect");
});

mqtt_client.on('message', function (topic, data) {
		console.log('message : ' + data);
		chat_model.chat(16, 17, "hi", function(error, results_chat){
			if(error){
				console.log(error);
				console.log(results_chat);
			}else{
				console.log(results_chat);
			}
		});
});




/******************************
 *          route             *
 ******************************/
// unsubscribe topic
router.post(['/'], function(req, res, next){
		var topic = req.body.topic;
		console.log("topic : " + topic);
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
