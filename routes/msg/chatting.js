var express = require('express');
var router = express.Router();
var config = require('config.json')('./config/config.json');

var request = require('request');

var xml2js = require('xml2js');
var parser = new xml2js.Parser();

var chatting_model = require('../../models/msg/chatting.model');


var mqtt = require('mqtt');
var mqtt_client = mqtt.connect('mqtt://' + config.iot.mqttproxy);

mqtt_client.on('connect', function () {
		console.log("MQTT Connect");
});

mqtt_client.on('message', function (topic, data) {
		console.log('message : ' + data);

		//var tempString = '{ "senderId" : 16, "receiverId" : 17, "message" : "good!"		}'

		var dataObject = JSON.parse(data);

		var senderId = dataObject.senderId;
		var receiverId = dataObject.receiverId;
		var message = dataObject.message;

		chatting_model.chat(senderId, receiverId, message, function(error, results_chat){
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
// subscribe topic
router.post(['/topic'], function(req, res, next){
		var topic = req.body.topic;
		console.log("subscribe topic : " + topic);
		mqtt_client.subscribe(topic);

		res.send("OK");
});

// unsubscribe topic
router.get(['/topic/:topic'], function(req, res, next) {
		var topic = req.params.topic;
		console.log("unsubscribe topic : " + topic);
		mqtt_client.unsubscribe(topic);

		res.send("OK");
});


module.exports = router;
