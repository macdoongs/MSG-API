var express = require('express');
var router = express.Router();
var config = require('config.json')('./config/config.json');

var request = require('request');

var xml2js = require('xml2js');
var parser = new xml2js.Parser();

var recovery_model = require('../../../../models/msg/recovery.model');

var db = require('../../../../models/msg/db_action');
var db_sql = require('../../../../models/msg/sql_action');

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


/******************************
 *          route             *
 ******************************/
router.post(['/'], function(req, res, next){


});


router.get(['/:phoneNumber'], function(req, res, next) {
	var input = req.params.phoneNumber;

	var trimPhoneNumber = input.split('-');

	var phoneNumber = "";

	for(var i=0; i<trimPhoneNumber.length; i++){
		phoneNumber += trimPhoneNumber[i];
	}

	recovery_model.find_password(phoneNumber, function(error, results_password){
		if(error){
			//console.log(error);
			res.send(results_password);
		}else{
			res.send(results_password);
		}
	});
});


module.exports = router;
