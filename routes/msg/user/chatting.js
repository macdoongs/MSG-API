var express = require('express');
var router = express.Router();
var config = require('config.json')('./config/config.json');

var request = require('request');

var xml2js = require('xml2js');
var parser = new xml2js.Parser();

var chatting_model = require('../../../models/msg/chatting.model');


var db = require('../../../models/msg/db_action');
var db_sql = require('../../../models/msg/sql_action');

var host = config.rds.host;
var port = config.rds.port;
var user = config.rds.user;
var password = config.rds.password;
var database = config.rds.msgdatabase;

db.connect(host, port, user, password, database, function(callback){
	if(callback == '1'){
		//console.log("DB connect ok!");
	}
});



var mqtt = require('mqtt');
var mqtt_client = mqtt.connect('mqtt://' + config.iot.mqttproxy);

mqtt_client.on('connect', function () {
		//console.log("MQTT Connect");
});

mqtt_client.on('message', function (topic, data) {
		//console.log('message : ' + data);

		//var tempString = '{ "senderId" : 16, "receiverId" : 17, "message" : "good!"		}'

		var dataObject = JSON.parse(data);

		var senderId = dataObject.senderId;
		var receiverId = dataObject.receiverId;
		var message = dataObject.message;

		chatting_model.chat(senderId, receiverId, message, function(error, results_chat){
			if(error){
				//console.log(error);
				//console.log(results_chat);
			}else{
				//console.log(results_chat);
			}
		});
});


router.get(['/:senderId/:receiverId'], function(req, res, next){
		var senderId = req.params.senderId;
		var receiverId = req.params.receiverId;

		chatting_model.load_chatting(senderId, receiverId, function(error, results_load_chat){
			if(error){
				res.send(results_load_chat);
			}else{
				res.send(results_load_chat);
			}
		});
});


router.post(['/'], function(req, res, next){

});



/******************************
 *          route             *
 ******************************/
// subscribe topic
router.post(['/topic/subscription'], function(req, res, next){
		var topic = req.body.topic;
		console.log("subscribe topic : " + topic);
		mqtt_client.subscribe(topic);

		res.send("OK");
});

// unsubscribe topic
router.post(['/topic/unsubscription'], function(req, res, next) {
	console.log("ok");
		var topic = req.body.topic;
		console.log("unsubscribe topic : " + topic);
		mqtt_client.unsubscribe(topic);

		res.send("OK");
});


module.exports = router;
