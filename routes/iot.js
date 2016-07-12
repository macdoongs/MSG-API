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
	var topicId = req.params.id;
	var topicSeq = null;
	var mqtt_client = config.iot.mqttproxy;

  var sql = 'SELECT * FROM cnt';

  conn.query(sql, function(err, rows, fields){
  	if(err){
  		console.log(err);
  	}else{
  		if(!rows.length){
  			console.log("Missing DB data.");
  		}else{
				var sRows = JSON.stringify(rows);
				var pRows = JSON.parse(sRows);

				for(var i = 0; i < rows.length; i++){
					if(rows[i].id == topicId){
							topicSeq = i;
					}
				}
				//var message = mqtt_req_connect(mqtt_client);

				var message = "hi";

				res.render('iot', { title: 'KYM coms', rows: pRows, id:topicId , message : message});

			}
		}
  });

});

var count = 0;
var usemqttaeid = config.iot.mqttaeid;
var req_topic = util.format('/oneM2M/req/+/%s/#', usemqttaeid);
var mqtt_client = mqtt.connect('mqtt://' + config.iot.mqttproxy);


//if(count == 0){
mqtt_client.on('connect', function () {
		mqtt_client.subscribe(req_topic);

		console.log(req_topic);

		var message = "Connect";

		console.log(message);

		return message;
});
//}

sh_timer.timer.on('tick', function() {
		count++;

		console.log(count);

		//if(count >= 100){
			//count = 0;



	      	mqtt_client.on('message', function (topic, message) {
	        //var topic_arr = topic.split("/");
					console.log(message);
	    });
		//}
});


/*
//function mqtt_req_connect(brokerip) {
		var usemqttaeid = config.iot.mqttaeid;
    var req_topic = util.format('/oneM2M/req/+/%s/#', usemqttaeid);
    var mqtt_client = mqtt.connect('mqtt://' + "52.78.68.226");

    mqtt_client.on('connect', function () {
        mqtt_client.subscribe(req_topic);

				var message = "connect";

				console.log(message);

				return message;
    });

    mqtt_client.on('message', function (topic, message) {
        //var topic_arr = topic.split("/");
				console.log(message);

				return message;
    });
//}
*/

module.exports = router;
