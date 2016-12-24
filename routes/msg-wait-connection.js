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


router.post(['/'], function(req, res, next){
	var senderPhoneNumber = req.body.senderPhoneNumber;
	var receiverPhoneNumber = req.body.receiverPhoneNumber;

	console.log("senderPhoneNumber : " + senderPhoneNumber + ", receiverPhoneNumber : " + receiverPhoneNumber);

	var sql = "SELECT _connection FROM WAIT_CONNECTION WHERE (senderPhoneNumber = ? AND receiverPhoneNumber = ?)";

  var params = [receiverPhoneNumber, senderPhoneNumber];

	conn.query(sql, params, function(error, rows, fields){
					if(error){
									console.log(error);
					}else{
									if(!rows.length){
                            console.log("Not connect!");

														var sql = "SELECT _connection FROM WAIT_CONNECTION WHERE (senderPhoneNumber = ? AND receiverPhoneNumber = ?)";

													  var params = [senderPhoneNumber, receiverPhoneNumber];

														conn.query(sql, params, function(error, rows, fields){
															if(error){
																console.log(error);
															}else{
																if(!rows.length){
																	var sql = "INSERT INTO WAIT_CONNECTION (senderPhoneNumber, receiverPhoneNumber) VALUES (?, ?)";
			  													var params = [senderPhoneNumber, receiverPhoneNumber];

			  													conn.query(sql, params, function(error, rows, fields){
			  															if(error){
			  																console.log(error);
			  															}else{
			  																if(!rows.length){
			  																	res.send('OK');
			  																}else{
			  																	res.send('Error');
			  																}
			  															}

			  													});
																}else{
																	res.send('Data');
																}
															}

														});


									}else{
											console.log("connect");
											var topic = senderPhoneNumber + "+" + receiverPhoneNumber;

											var sql = "UPDATE WAIT_CONNECTION SET _connection = true, Topic = ? WHERE senderPhoneNumber = ?";

											var params = [receiverPhoneNumber, ];

											conn.query(sql, params, function(error, rows, fields){
												if(error){
													console.log(error);
												}else{
			                      res.send("CONNECT");
												}
											});




									}
					}
			});

});


/* GET home page. */
router.get(['/'], function(req, res, next) {
		res.send("OK");
});


module.exports = router;
