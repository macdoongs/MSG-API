var express = require('express');
var router = express.Router();
var config = require('config.json')('./config/config.json');


var invitation_model = require('../../../models/msg/invitation.model');

var db = require('../../../models/msg/db_action');
var db_sql = require('../../../models/msg/sql_action');

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

var request = require('request');

var xml2js = require('xml2js');
var parser = new xml2js.Parser();

/******************************
 *          route             *
 ******************************/
router.post(['/'], function(req, res, next){
	var userId = req.body.userId;
	var receiverPhoneNumber = req.body.receiverPhoneNumber;
	var roleName = req.body.roleName;

	invitation_model.invite_user(userId, receiverPhoneNumber, roleName, function(error, results_invite){
		if(error){
			res.send(results_invite);
		}else{
			res.send(results_invite);
		}
	});
});


router.get(['/sender/:userId/receiver/:receiverPhoneNumber'], function(req, res, next) {
	 var userId = req.params.userId;
	 var receiverPhoneNumber = req.params.receiverPhoneNumber;

	 invitation_model.load_user_invite_user(userId, receiverPhoneNumber, function(error, results_invite){
		 if(error){
			 res.send(results_invite);
		 }else{
			 res.send(results_invite);
		 }
	 });
});


module.exports = router;
