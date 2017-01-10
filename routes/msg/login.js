var express = require('express');
var router = express.Router();
var config = require('config.json')('./config/config.json');

var request = require('request');

var xml2js = require('xml2js');
var parser = new xml2js.Parser();

var crypto = require('crypto');

var key = config.crypto.key;      // 암호화, 복호화를 위한 키


var login_model = require('../../models/msg/login.model');

/******************************
 *          route             *
 ******************************/
router.post(['/'], function(req, res, next){
	var input = req.body.phoneNumber;
	var inputPassword = req.body.password;

	var trimPhoneNumber = input.split('-');
	var phoneNumber = "";

	//console.log(trimPhoneNumber);

	//console.log(trimPhoneNumber.length);

	for(var i=0; i<trimPhoneNumber.length; i++){
		phoneNumber += trimPhoneNumber[i];
	}

	//console.log("phoneNumber : " + phoneNumber + ", password : " + inputPassword);

	login_model.app_login(phoneNumber, inputPassword, function(error, result){
		//console.log("error : " + error + ", result : " + result);
		res.send(result);
	});

});


router.get(['/', '/:userId'], function(req, res, next) {

});


module.exports = router;
