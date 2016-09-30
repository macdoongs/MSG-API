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
	database  : config.rds.ajouiotdb
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


	var sql = 'SELECT * FROM USER WHERE (email = "' +  req.body.email + '" AND password = "' + req.body.password + '")';

													conn.query(sql, function(error, rows, fields){
																	if(error){
																					console.log(error);
																	}else{
																					if(!rows.length){
																									console.log("No id, Insert!");

																									var sql = 'INSERT INTO USER (email, password) VALUES (?, ?)';
																									var params = [req.body.email, req.body.password];

																									conn.query(sql, params, function(err, rows, fields){
																													if(err){
																																	throw err;
																													} else{
																																	console.log('rows : ', rows);
																																	console.log('fields : ', fields);
																																	res.send('sign up OK!');
																													}
																								 });
																					}else{
																									console.log("Already have id.");
																									res.redirect('/signup');
																					}
																	}
															});



	//res.send('Good!');
});

module.exports = router;
