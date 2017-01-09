var express = require('express');
var router = express.Router();
var config = require('config.json')('./config/config.json');

var user_info_model = require('../../models/msg/user-info.model');


/******************************
 *          route             *
 ******************************/
router.post(['/'], function(req, res, next){
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


/* GET home page. */
router.get(['/:id'], function(req, res, next) {
	var userId = req.params.id;

	user_info_model.load_user_information(userId, function(error, results_load_information){
		if(error){
			res.send(results_load_information);
		}else{
			res.send(results_load_information);
		}
	});

});


module.exports = router;
