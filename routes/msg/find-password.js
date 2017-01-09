var express = require('express');
var router = express.Router();
var config = require('config.json')('./config/config.json');

var mysql = require('mysql');

var request = require('request');

var xml2js = require('xml2js');
var parser = new xml2js.Parser();


/******************************
 *          route             *
 ******************************/
router.post(['/'], function(req, res, next){
	var input = req.body.phoneNumber;

	var trimPhoneNumber = input.split('-');

	var phoneNumber = "";

	for(var i=0; i<trimPhoneNumber.length; i++){
		phoneNumber += trimPhoneNumber[i];
	}

	db_sql.select_user_phone_number(phoneNumber, function(error, results_user){
		if(error){
			//console.log("error : " + error);
			res.send(results_user);
		}else{
			res.send(results_user);
		}
	});

});


router.get(['/'], function(req, res, next) {

});


module.exports = router;
