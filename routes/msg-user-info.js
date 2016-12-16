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
	var userId = req.body.userId;
	var profile = req.body.profile;
	var birthday = req.body.birthday;
	var sex = req.body.sex;

	console.log("userId : " + userId + ", profile : " + profile + ", birthday : " + birthday + ", sex : " + sex);

	var sql = "INSERT INTO USER_INFO (_userId, profile , birthday, sex) VALUES (?, ?, ?, ?)";
	var params = [userId, profile, birthday, sex];

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
		var userId = req.params.id;

		var sql = "SELECT Profile, Birthday, Sex FROM USER_INFO WHERE _userId = '" + userId + "'";

		var result = "";

		conn.query(sql, function(error, rows, fields){
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
