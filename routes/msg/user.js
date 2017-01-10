var express = require('express');
var router = express.Router();
var config = require('config.json')('./config/config.json');

var user_model = require('../../models/msg/user.model');

var user_info_model = require('../../models/msg/user-info.model');

var user_setting_model = require('../../models/msg/user-setting.model');

/******************************
 *          route             *
 ******************************/
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

	user_model.app_login(phoneNumber, inputPassword, function(error, result){
		//console.log("error : " + error + ", result : " + result);
		res.send(result);
	});

});

router.get(['/:userId/repos'], function(req, res, next) {
		var userId = req.params.userId;

		var sql = "SELECT PhoneNumber, Nickname, Sex, Role, Birthday, Profile, Enable, Alert, WeekNumber, SendTimes FROM USER_SETTING INNER JOIN (SELECT PhoneNumber, Role, Z._userId, Nickname, Sex, Birthday, Profile, Topic, _choosingId  FROM USER_INFO INNER JOIN (SELECT Y._userId, Role, PhoneNumber, _choosingId, Topic FROM MAP_USER INNER JOIN (SELECT X._userId, Role, PhoneNumber, _choosingId FROM USER_ROLE INNER JOIN (SELECT U._userId, PhoneNumber, _choosingId, _roleId FROM USER AS U INNER JOIN CHOOSE_ROLE AS C ON U._userId = C._userId) AS X ON USER_ROLE._roleId = X._roleId) AS Y ON _parentId = Y._userId OR _childId = Y._userId) AS Z ON USER_INFO._userId = Z._userId) AS K ON K._userId = USER_SETTING._userId WHERE USER_SETTING._userId = ? GROUP BY PhoneNumber";

		var params = [userId];

		var result = "";

});


router.post(['/info'], function(req, res, next){
	var userId = req.body.userId;
	var nickname = req.body.nickname;
	var sex = req.body.sex;
	var birthday = req.body.birthday;
	var profile = req.body.profile;

	user_info_model.register_user_information(userId, nickname, sex, birthday, profile, function(error, results_register_information){
		if(error){
			res.send(results_register_information);
		}else{
			res.send(results_register_information);
		}
	});

});


router.get(['/:userId/info'], function(req, res, next) {
	var userId = req.params.userId;

	user_info_model.load_user_information(userId, function(error, results_load_information){
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

	user_setting_model.register_user_setting(userId, messageAlert, reserveEnable, reserveAlert, weekNumber, reserveNumber, function(error, results_register_setting){
		if(error){
			res.send(results_register_setting);
		}else{
			res.send(results_register_setting);
		}
	});

});


router.get(['/:userId/setting'], function(req, res, next) {
		var userId = req.params.userId;

		user_setting_model.load_user_setting(userId, function(error, results_load_setting){
			if(error){
				res.send(results_load_setting);
			}else{
				res.send(results_load_setting);
			}
		});

});

module.exports = router;
