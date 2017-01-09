var express = require('express');
var router = express.Router();
var config = require('config.json')('./config/config.json');



/******************************
 *          route             *
 ******************************/
router.post(['/'], function(req, res, next){


});


/* GET home page. */
router.get(['/:userId/repos'], function(req, res, next) {
		var userId = req.params.userId;

		var sql = "SELECT PhoneNumber, Nickname, Sex, Role, Birthday, Profile, Enable, Alert, WeekNumber, SendTimes FROM USER_SETTING INNER JOIN (SELECT PhoneNumber, Role, Z._userId, Nickname, Sex, Birthday, Profile, Topic, _choosingId  FROM USER_INFO INNER JOIN (SELECT Y._userId, Role, PhoneNumber, _choosingId, Topic FROM MAP_USER INNER JOIN (SELECT X._userId, Role, PhoneNumber, _choosingId FROM USER_ROLE INNER JOIN (SELECT U._userId, PhoneNumber, _choosingId, _roleId FROM USER AS U INNER JOIN CHOOSE_ROLE AS C ON U._userId = C._userId) AS X ON USER_ROLE._roleId = X._roleId) AS Y ON _parentId = Y._userId OR _childId = Y._userId) AS Z ON USER_INFO._userId = Z._userId) AS K ON K._userId = USER_SETTING._userId WHERE USER_SETTING._userId = ? GROUP BY PhoneNumber";

		var params = [userId];

		var result = "";

});


module.exports = router;
