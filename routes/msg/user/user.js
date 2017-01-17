var express = require('express');
var router = express.Router();
var config = require('config.json')('./config/config.json');

var user_model = require('../../../models/msg/user.model');

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
router.get(['/'], function(req, res, next){

});

router.post(['/signup'], function(req, res, next){
	var input = req.body.phoneNumber;
	var password = req.body.password;

	var trimPhoneNumber = input.split('-');
	var phoneNumber = "";

	//console.log(trimPhoneNumber);

	//console.log(trimPhoneNumber.length);

	for(var i=0; i<trimPhoneNumber.length; i++){
		phoneNumber += trimPhoneNumber[i];
	}

	//console.log("phoneNumber : " + phoneNumber + ", password : " + password);

	user_model.signup(phoneNumber, password, function(error, results_signup){
		if(error){
			console.log("error : " + error);
			res.send(results_signup);
		}else{
			res.send(results_signup);
		}
	});
});

router.get(['/load/:userId'], function(req, res, next){
	var userId = req.params.userId;

	user_model.load_user(userId, function(error, results_signup){
		if(error){
			console.log("error : " + error);
			res.send(results_signup);
		}else{
			res.send(results_signup);
		}
	});
});

router.post(['/login'], function(req, res, next){
	var input = req.body.phoneNumber;
	var inputPassword = req.body.password;

	var trimPhoneNumber = input.split('-');
	var phoneNumber = "";

	//console.log(trimPhoneNumber);

	//console.log(trimPhoneNumber.length);

	for(var i=0; i<trimPhoneNumber.length; i++){
		phoneNumber += trimPhoneNumber[i];
	}

	//console.log("phoneNumber : " + phoneNumber + ", password : " + inputPassword);

	user_model.login(phoneNumber, inputPassword, function(error, results_login){
		//console.log("error : " + error + ", result : " + result);
		if(error){
			res.send(results_login);
		}else{
			res.send(results_login);
		}
	});

});

router.get(['/:phoneNumber/duplicate'], function(req, res, next){
	var phoneNumber = req.params.phoneNumber;

	user_model.duplicate_check(phoneNumber, function(error, results_duplicate_check){
		if(error){
			res.send(results_duplicate_check);
		}else{
			if(results_duplicate_check[0] == null){
				res.send("OK");
			}else{
				res.send(results_duplicate_check);
			}
		}
	});
});

router.get(['/:phoneNumber'], function(req, res, next) {
		var userId = req.params.phoneNumber;



});


router.post(['/info'], function(req, res, next){
	var userId = req.body.userId;
	var nickname = req.body.nickname;
	var sex = req.body.sex;
	var birthday = req.body.birthday;
	var profile = req.body.profile;

	user_model.register_user_information(userId, nickname, sex, birthday, profile, function(error, results_register_information){
		if(error){
			res.send(results_register_information);
		}else{
			res.send(results_register_information);
		}
	});

});


router.get(['/:userId/info'], function(req, res, next) {
	var userId = req.params.userId;

	user_model.load_user_information(userId, function(error, results_load_information){
		if(error){
			res.send(results_load_information);
		}else{
			res.send(results_load_information);
		}
	});

});


router.post(['/setting'], function(req, res, next){
	var userId = req.body.userId;
	var messageAlert = req.body.messageAlert;
	var reserveEnable = req.body.reserveEnable;
	var reserveAlert = req.body.reserveAlert;
	var weekNumber = req.body.weekNumber;
	var reserveNumber = req.body.reserveNumber;

	user_model.register_user_setting(userId, messageAlert, reserveEnable, reserveAlert, weekNumber, reserveNumber, function(error, results_register_setting){
		if(error){
			res.send(results_register_setting);
		}else{
			res.send(results_register_setting);
		}
	});
});

router.put(['/setting'], function(req, res, next){
	var userId = req.body.userId;
	var messageAlert = req.body.messageAlert;
	var reserveEnable = req.body.reserveEnable;
	var reserveAlert = req.body.reserveAlert;
	var weekNumber = req.body.weekNumber;
	var reserveNumber = req.body.reserveNumber;

	user_model.register_user_setting(userId, messageAlert, reserveEnable, reserveAlert, weekNumber, reserveNumber, function(error, results_register_setting){
		if(error){
			res.send(results_register_setting);
		}else{
			res.send(results_register_setting);
		}
	});
});

router.get(['/:userId/setting'], function(req, res, next) {
		var userId = req.params.userId;

		user_model.load_user_setting(userId, function(error, results_load_setting){
			if(error){
				res.send(results_load_setting);
			}else{
				res.send(results_load_setting);
			}
		});

});

router.delete(['/:userId/setting'], function(req, res, next) {
		var userId = req.params.userId;

		user_model.load_user_setting(userId, function(error, results_load_setting){
			if(error){
				res.send(results_load_setting);
			}else{
				res.send(results_load_setting);
			}
		});

});

module.exports = router;
