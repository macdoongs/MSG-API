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

router.post(['/'], function(req, res, next){
	var input = req.body.phoneNumber;

	var trimPhoneNumber = input.split('-');

	var phoneNumber = "";

	for(var i=0; i<trimPhoneNumber.length; i++){
		phoneNumber += trimPhoneNumber[i];
	}


	console.log("phoneNumber : " + phoneNumber);

	var sql = "SELECT Password FROM USER WHERE PhoneNumber = ?";
	var params = [phoneNumber];

	conn.query(sql, params, function(error, rows, fields){
			if(error){
				console.log(error);
			}else{
				if(!rows.length){
					res.send('Error');
				}else{
					res.send("" + rows[0].Password);
				}
			}

	});
});


/* GET home page. */
router.get(['/'], function(req, res, next) {

});


module.exports = router;
