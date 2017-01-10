var express = require('express');
var router = express.Router();
var config = require('config.json')('./config/config.json');


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


var crypto = require('crypto');

var key = config.crypto.key;      // 암호화, 복호화를 위한 키


var request = require('request');

var xml2js = require('xml2js');
var parser = new xml2js.Parser();


var FCM = require('fcm-push');

var serverKey = config.firebase.serverkey;
var fcm = new FCM(serverKey);

/******************************
 *          route             *
 ******************************/
router.post(['/'], function(req, res, next){
	var parentId = req.body.parentId;
	var childId = req.body.childId;
	var topic = parentId + "_" + childId;
	var deviceToken = req.body.deviceToken;

	var message = {
    to: 'news', // required fill with device token or topics
		collapse_key: 'your_collapse_key',
		data: {
        your_custom_data_key: 'your_custom_data_value'
    },
    notification: {
        title: 'Alert test',
        body: 'hello'
    }
	};

	//callback style
	fcm.send(message, function(err, response){
	    if (err) {
	        console.log("Something has gone wrong!");
	    } else {
	        console.log("Successfully sent with response: ", response);
	    }
	});
/*
	console.log("parentId : " + parentId + ", childId : " + childId + ", Topic : " + topic);

	var sql = "INSERT INTO MAP_USER (_mappingId, _parentId, _childId, Topic) SELECT null, ?, ?, ? FROM DUAL WHERE NOT EXISTS (SELECT * FROM MAP_USER WHERE _parentId = ? AND _childId = ?)";

	var params = [parentId, childId, topic, parentId, childId];

	conn.query(sql, params, function(error, rows, fields){
					if(error){
									console.log(error);
					}else{
									if(!rows.length){
													console.log("OK");
													res.send("OK");
									}else{
													console.log("Error");
													res.send("Error");
									}
					}
			});
*/
	res.send("test");
});


/* GET home page. */
router.get(['/:phoneNumber'], function(req, res, next) {
		var input = req.params.phoneNumber;

		var trimPhoneNumber = input.split('-');
		var phoneNumber = "";

		console.log(trimPhoneNumber);

		console.log(trimPhoneNumber.length);

		for(var i=0; i<trimPhoneNumber.length; i++){
			phoneNumber += trimPhoneNumber[i];
		}

		console.log("phoneNumber : " + phoneNumber);

		var sql = "(SELECT * FROM MAP_USER WHERE _childId IN (SELECT _userId FROM USER WHERE PhoneNumber = ?)) UNION (SELECT * FROM MAP_USER WHERE _parentId IN (SELECT _userId FROM USER WHERE PhoneNumber = ?))";

		var params = [phoneNumber, phoneNumber];



});


module.exports = router;
