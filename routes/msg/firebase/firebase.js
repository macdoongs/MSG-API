
var express = require('express');
var router = express.Router();




var config = require('config.json')('./config/config.json');


var firebase_model = require('../../../models/msg/firebase.model');


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

router.post(['/register'], function(req, res, next){
  var deviceToken = req.body.deviceToken;
  var userId = Number(req.body.userId);

  firebase_model.register(userId, deviceToken, function(error, result){
		if(error){
			res.send(result);
		}else{
    	res.send(result);
		}
  });

});

module.exports = router;
