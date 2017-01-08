var express = require('express');
var router = express.Router();
var config = require('config.json')('./config/config.json');

var mysql = require('mysql');

var conn = mysql.createConnection({
	host      : config.rds.host,
	user      : config.rds.user,
	password  : config.rds.password,
	database  : config.rds.msgdatabase,
	dateStrings : 'date'
});

conn.connect();


router.post(['/'], function(req, res, next){
	var userId = req.body.userId;
	var profile = req.body.profile;
	var sex = req.body.sex;

	console.log("userId : " + userId + ", profile : " + profile + ", sex : " + sex);

	var sql = "SELECT * FROM USER_INFO WHERE _userId = ?";
	var params = [userId];

	conn.query(sql, params, function(error, rows, fields){
		if(error){
			console.log(error);
		}else{
			if(!rows.length){
				var sql = "INSERT INTO USER_INFO (_userId, profile , sex) VALUES (?, ?, ?)";
				var params = [userId, profile, sex];

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
				res.send('Already');
			}
		}


	});




});


/* GET home page. */
router.get(['/:userId/repos'], function(req, res, next) {
		var userId = req.params.userId;

		var sql = "SELECT PhoneNumber, Nickname, Sex, Role, Birthday, Profile, Enable, Alert, WeekNumber, SendTimes FROM USER_SETTING INNER JOIN (SELECT PhoneNumber, Role, Z._userId, Nickname, Sex, Birthday, Profile, Topic, _choosingId  FROM USER_INFO INNER JOIN (SELECT Y._userId, Role, PhoneNumber, _choosingId, Topic FROM MAP_USER INNER JOIN (SELECT X._userId, Role, PhoneNumber, _choosingId FROM USER_ROLE INNER JOIN (SELECT U._userId, PhoneNumber, _choosingId, _roleId FROM USER AS U INNER JOIN CHOOSE_ROLE AS C ON U._userId = C._userId) AS X ON USER_ROLE._roleId = X._roleId) AS Y ON _parentId = Y._userId OR _childId = Y._userId) AS Z ON USER_INFO._userId = Z._userId) AS K ON K._userId = USER_SETTING._userId WHERE USER_SETTING._userId = ? GROUP BY PhoneNumber";

		var params = [userId];

		var result = "";

		conn.query(sql, params, function(error, rows, fields){
				if(error){
					console.log(error);
				}else{
					if(!rows.length){
						res.send("Error");
					}else{

						for(var i=0; i<rows.length; i++){
							result = "PhoneNumber:" + rows[i].PhoneNumber + " / Nickname:" + rows[i].Nickname + " / Sex:" + rows[i].Sex + " / Role:" + rows[i].Role + " / Birthday:" + rows[i].Birthday + " / Profile:" + rows[i].Profile + " / Enable:" + rows[i].Enable + " / Alert:" + rows[i].Alert + " / WeekNumber:" + rows[i].WeekNumber + " / SendTimes:" + rows[i].SendTimes + "\n";

						}
						//res.json(rows[0]);
						res.json(rows);
						//res.send(result);
					}
				}

		});


});


module.exports = router;
