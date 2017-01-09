var express = require('express');
var router = express.Router();
var config = require('config.json')('./config/config.json');

var request = require('request');

var xml2js = require('xml2js');
var parser = new xml2js.Parser();

var db = require('../../models/msg/db_action');
var db_sql = require('../../models/msg/sql_action');

var host = config.rds.host;
var port = config.rds.port;
var user = config.rds.user;
var password = config.rds.password;
var database = config.rds.msgdatabase;

db.connect(host, port, user, password, database, function(callback){
	if(callback == '1'){
		console.log("DB connect ok!");
	}
});


/******************************
 *          route             *
 ******************************/
router.post(['/'], function(req, res, next) {
	var input = req.body.phoneNumber;
	var password = req.body.password;

	var trimPhoneNumber = input.split('-');
	var phoneNumber = "";

	//console.log(trimPhoneNumber);

	//console.log(trimPhoneNumber.length);

	for(var i=0; i<trimPhoneNumber.length; i++){
		phoneNumber += trimPhoneNumber[i];
	}

	//console.log("phoneNumber : " + phoneNumber + ", password : " + password);

	db_sql.select_user_phone_number(phoneNumber, function(error, results_user){
		if(error){
			console.log("error : " + error);
			res.send(results_user);
		}else{
			db_sql.insert_user(phoneNumber, password, function(error, results_user){
				if(error){
					console.log("error : " + error);
					res.send(results_user);
				}else{
					res.send(results_user);
				}
			});
		}
	});

});


router.get(['/:phoneNumber'], function(req, res, next) {
	var input = req.params.phoneNumber;

	var trimPhoneNumber = input.split('-');
	var phoneNumber = "";

	//console.log(trimPhoneNumber);

	//console.log(trimPhoneNumber.length);

	for(var i=0; i<trimPhoneNumber.length; i++){
		phoneNumber += trimPhoneNumber[i];
	}

	//console.log("phoneNumber : " + phoneNumber);

});


module.exports = router;
