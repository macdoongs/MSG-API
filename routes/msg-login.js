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

var request = require('request');

var xml2js = require('xml2js');
var parser = new xml2js.Parser();

var crypto = require('crypto');

var key = config.crypto.key;      // 암호화, 복호화를 위한 키


conn.connect();

router.post(['/'], function(req, res, next){
	var phoneNumber = req.body.phoneNumber;
	var inputPassword = req.body.password;

	console.log("phoneNumber : " + phoneNumber + ", password : " + inputPassword);

	var sql = "SELECT _userId, Password FROM USER WHERE PhoneNumber = ?";
	var params = [phoneNumber];

	conn.query(sql, params, function(error, rows, fields){
			if(error){
				console.log(error);
			}else{
				if(!rows.length){
					res.send('Error');
				}else{
					if(inputPassword == rows[0].Password){
						var result = "";

						var today = new Date().getTime();

						// 해시 생성
						var shasum = crypto.createHash('sha1'); // shasum은 Hash 클래스의 인스턴스입니다.
						shasum.update(phoneNumber);
						var output = shasum.digest('hex') + today;

						console.log("output : " + output);



						res.send("" + rows[0]._userId + "/" + output);
					}else{
						res.send("No");
					}

				}
			}

	});
});


/* GET home page. */
router.get(['/', '/:userId'], function(req, res, next) {
		var userId = req.params.userId;

		console.log("userId : " + userId);

		var sql = "";

		if(userId == undefined){
			sql = "SELECT Log FROM ERROR";
		}else{
			sql = "SELECT Log FROM ERROR WHERE _userId = " + userId;
		}

		conn.query(sql, function(error, rows, fields){
			if(error){
				console.log(error);
			}else{
				if(!rows.length){
					res.send("No Log");
				}else{
					var result = "";

					for(var i=0; i<rows.length; i++){
						result += "" + rows[i].Log + "\n";
					}
					res.send(result);
				}
			}
		});


});


module.exports = router;
