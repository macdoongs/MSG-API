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


router.post(['/'], function(req, res, next){
	var swEnable = req.body.swEnable;
	var swAlert = req.body.swAlert;
	var weekNum = req.body.weekNum;
	var userId = req.body.userId;
	var times = req.body.times;
	var message = req.body.message;

	console.log("swEnable : " + swEnable + ", swAlert : " + swAlert + ", weekNum : " + weekNum + ", userId : " + userId + ", times : " + times + ", message : " + message);

	var enable = "";
	var alert = "";

	if(swEnable == "true"){
		enable = true;
	}else{
		enable = false;
	}

	if(swAlert == "true"){
		alert = true;
	}else{
		alert = false;
	}

	var sql = "INSERT INTO USER_SETTING (_userId, Enable, Alert, WeekNumber, SendTimes) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE Enable = ?, Alert = ?, WeekNumber = ?, SendTimes = ?";
	var params = [userId, enable, alert, weekNum, times, enable, alert, weekNum, times];

	conn.query(sql, params, function(error, rows, fields){
		if(error){
			console.log(error);
		}else{
			if(!rows.length){
				console.log("OK");
				res.send('OK');
			}else{
				console.log("Error");
				res.send('Error');
			}
		}

	});



});


/* GET home page. */
router.get(['/', '/:id'], function(req, res, next) {
		var userId = req.params.id;

		var sql = "SELECT Profile, Birthday, Sex FROM USER_INFO WHERE _userId = ?";

		var params = [userId];

		var result = "";

		conn.query(sql, params, function(error, rows, fields){
				if(error){
					console.log(error);
				}else{
					for(var i=0; i<rows.length; i++){
						result = "" + rows[i].Profile + "," + rows[i].Birthday + "," + rows[i].Sex + "\n";
					}
					res.send(result);
				}

		});


});


module.exports = router;
