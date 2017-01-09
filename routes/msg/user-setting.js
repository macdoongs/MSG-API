var express = require('express');
var router = express.Router();
var config = require('config.json')('./config/config.json');

var user_setting_model = require('../../models/msg/user-setting.model');


/******************************
 *          route             *
 ******************************/
router.post(['/'], function(req, res, next){
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


/* GET home page. */
router.get(['/', '/:id'], function(req, res, next) {
		var userId = req.params.id;

		user_setting_model.load_user_setting(userId, function(error, results_load_setting){
			if(error){
				res.send(results_load_setting);
			}else{
				res.send(results_load_setting);
			}
		});

});


module.exports = router;
