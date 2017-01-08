var express = require('express');
var router = express.Router();
var config = require('config.json')('./config/config.json');

var request = require('request');

var xml2js = require('xml2js');
var parser = new xml2js.Parser();


var db = require('../../models/msg/db_action');
var db_sql = require('../../models/msg/sql_action');

db.connect(function(callback){
	if(callback == '1'){
		console.log("DB connect ok!");
	}
});

router.post(['/'], function(req, res, next){
	var userId = req.body.userId;
	var log = req.body.log;

	console.log("userId : " + userId + ", log : " + log);

	var sql = "INSERT INTO ERROR (_userId , Log) VALUES (?, ?)";
	var params = [userId, log];

});


/* GET home page. */
router.get(['/', '/:userId'], function(req, res, next) {
		var userId = req.params.userId;

		console.log("userId : " + userId);

		if(userId == undefined){
			db_sql.select_error(function(error, results_error){
				if(error){
					console.log(error);
					res.send(results_error);
				}else{
					res.send(results_error);
				}
			});
		}else{
			db_sql.select_user_error(userId, function(error, results_user_error){
				if(error){
					console.log(error);
					res.send(results_user_error);
				}else{
					res.send(results_user_error);
				}
			});
		}


});


module.exports = router;
