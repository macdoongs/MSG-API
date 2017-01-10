var express = require('express');
var router = express.Router();
var config = require('config.json')('./config/config.json');

var request = require('request');

var xml2js = require('xml2js');
var parser = new xml2js.Parser();

var error_model = require('../../models/msg/error.model');

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
router.post(['/user'], function(req, res, next){
	var userId = req.body.userId;
	var log = req.body.log;

	console.log("userId : " + userId + ", log : " + log);

	error_model.submit_error(userId, log, function(error, results_error){
		if(error){
			//console.log(error);
			res.send(results_error);
		}else{
			res.send(results_error);
		}
	});

});

router.get(['/', '/user/:userId'], function(req, res, next) {
		var userId = req.params.userId;

		//console.log("userId : " + userId);

		error_model.load_error(userId, function(error, results_error){
			if(error){
				//console.log(error);
				res.send(results_error);
			}else{
				res.send(results_error);
			}
		});

});


module.exports = router;
