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

conn.connect();

var sh_timer = require('./timer');

/* GET home page. */
router.get(['/', '/:id'], function(req, res, next) {
	var topicId = req.params.id;
	//global.ROOMID = req.params.id;
  var myName = config.rds.user;
	var topicSeq = null;
	var mqtt_client = config.iot.mqttproxy;

	var message = topicId;

	//res.send('ok')
	//console.log('chat _ ROOMID : ' + global.ROOMID);
	res.render('signup', { title: 'Ajou IoT', message : message});

});

router.post(['/', '/:id'], function(req, res, next) {

	console.log(Object.keys(req));

	console.log('email : ' + req.body.email);
	console.log('password : ' + req.body.password);

	res.send('Good!')
});

module.exports = router;
