var express = require('express');
var router = express.Router();
var config = require('config.json')('./config/config.json');

var reservation_model = require('../../../models/msg/reservation.model');


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


/******************************
 *          route             *
 ******************************/
router.post(['/'], function(req, res, next){
	var senderId = req.body.senderId;
	var receiverId = req.body.receiverId;
	var reservationMessageId = req.body.reservationMessageId;
	var reserveDTM = req.body.reserveDTM;

	reservation_model.reserve_message(senderId, receiverId, reservationMessageId, reserveDTM, function(error, results_reserve){
		if(error){
			res.send(results_reserve);
		}else{
			res.send(results_reserve);
		}
	});
});


router.get(['/:userId'], function(req, res, next) {
	var sql = "SELECT _typeId, Time, Content FROM RESERVED_MESSAGE";

});


module.exports = router;
