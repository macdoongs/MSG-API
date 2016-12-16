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

var request = require('request');

var xml2js = require('xml2js');
var parser = new xml2js.Parser();

conn.connect();



router.post(['/'], function(req, res, next) {
	var phoneNumber = req.body.phoneNumber;
	var password = req.body.password;

	console.log("phoneNumber : " + phoneNumber + ", password : " + password);

	var sql = 'SELECT _userId FROM USER WHERE PhoneNumber = "' + phoneNumber + '"';

	conn.query(sql, function(error, rows, fields){
					if(error){
									console.log(error);
					}else{
									if(!rows.length){
													console.log("No id, Insert!");

													var sql = 'INSERT INTO USER (PhoneNumber, Password) VALUES (?, ?)';
													var params = [phoneNumber, password];

													conn.query(sql, params, function(err, rows, fields){
																	if(err){
																					console.log(err);
																					res.send("Error");
																	} else{
																					res.send("OK");
																	}
												 });
									}else{
													console.log("Already have id.");
													res.send("" + rows[0]._userId);
									}

					}
			});

});


/* GET home page. */
router.get(['/:phoneNumber'], function(req, res, next) {
	var phoneNumber = req.params.phoneNumber;

	console.log("phoneNumber : " + phoneNumber);

	var sql = 'SELECT _userId FROM USER WHERE PhoneNumber = "' + phoneNumber + '"';

	conn.query(sql, function(error, rows, fields){
					if(error){
									console.log(error);
					}else{
									if(!rows.length){
													console.log("No id, Insert!");
													res.send("No");
									}else{
													console.log("Already have id.");
													res.send("" + rows[0]._userId);
									}

					}
			});

});


module.exports = router;
