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
	var userId = req.body.userId;
	var log = req.body.log;

	console.log("userId : " + userId + ", log : " + log);

	var sql = "INSERT INTO ERROR (_userId , Log) VALUES (?, ?)";
	var params = [userId, log];

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
});


/* GET home page. */
router.get(['/', '/:id'], function(req, res, next) {

});


module.exports = router;
