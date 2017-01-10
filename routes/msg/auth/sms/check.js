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

var redis = require('redis');

client = redis.createClient(config.redis.port, config.redis.host);
client.auth(config.redis.password);


router.use(function(req,res,next){
      req.cache = client;
      next();
});

/******************************
 *          route             *
 ******************************/
router.post(['/'], function(req, res, next){
	var phoneNumber = req.body.phoneNumber;
	var authCode = req.body.authCode;

	console.log("phoneNumber : " + phoneNumber + ", authCode : " + authCode);

	var key = phoneNumber;

	req.cache.get(key, function(err, data){
			 if(err){
						 console.log(err);
						 res.send("error " + err);
						 return;
			 }

			 var value = JSON.parse(data);
			 console.log(data);

			 if(data == null){
				 // expiration
				 res.send("No");
			 }

			 if(authCode == data){
				 res.send("OK");
			 }else{
				 res.send("No");
			 }
			 //res.json(value);
	});




});


/* GET home page. */
router.get(['/'], function(req, res, next) {




});


module.exports = router;
