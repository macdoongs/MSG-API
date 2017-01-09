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

/******************************
 *          route             *
 ******************************/
router.post(['/'], function(req, res, next){
	var userId = req.body.userId;
	var profile = req.body.profile;
	var sex = req.body.sex;
	var nickname = req.body.nickname;

	console.log("userId : " + userId + ", profile : " + profile + ", sex : " + sex + ", nickname : " + nickname);

	var sql = "INSERT INTO USER_INFO (_userId, Profile, Sex, Nickname) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE Profile = ?, Sex = ?, Nickname = ?";
	var params = [userId, profile, sex, nickname, profile, sex, nickname];

	conn.query(sql, params, function(error, rows, fields){
		if(error){
			console.log(error);
		}else{
			if(!rows.length){
				console.log('OK');
				res.send('OK');
			}else{
				console.log('Error');
				res.send('Error');
			}
		}


	});
});


/* GET home page. */
router.get(['/', '/:id'], function(req, res, next) {
	var userId = req.params.id;

	var sql = "SELECT Profile, Sex FROM USER_INFO WHERE _userId = ?";

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
