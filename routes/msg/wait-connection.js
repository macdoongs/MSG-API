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
// http://stackoverflow.com/questions/11187961/date-format-in-node-js


conn.connect();

var request = require('request');

var xml2js = require('xml2js');
var parser = new xml2js.Parser();

/******************************
 *          route             *
 ******************************/
router.post(['/'], function(req, res, next){
	var userId = req.body.userId;
	var receiverPhoneNumber = req.body.receiverPhoneNumber;
	var inviteTime = req.body.inviteTime;

	console.log("userId : " + userId + ", receiverPhoneNumber : " + receiverPhoneNumber);

	var sql = "SELECT _choosingId FROM CHOOSE_ROLE WHERE (_userId = ?)";

  var params = [userId];

	conn.query(sql, params, function(error, rows, fields){
					if(error){
									console.log(error);
					}else{
									if(!rows.length){
                            console.log("Error");

														res.send("Error");
									}else{
											var choosingId = rows[0]._choosingId;
											console.log("_choosingId : " + choosingId);

											var sql = "SELECT _choosingId FROM CHOOSE_ROLE WHERE _userId IN (SELECT _userId FROM USER WHERE PhoneNumber IN (SELECT ReceiverPhoneNumber FROM INVITE_USER WHERE _choosingId IN (SELECT _choosingId FROM CHOOSE_ROLE WHERE _userId = ?)))";

											var params = [userId];

											conn.query(sql, params, function(error, rows, fields){
												if(error){
													console.log(error);
												}else{
													if(!rows.length){
														console.log("Error");

														res.send("No");
													}else{

													}
												}
											});

											var sql = "INSERT INTO INVITE_USER (_isConnection, _choosingId, ReceiverPhoneNumber, InviteTime) VALUES(?, ?, ?, ?)";

											var params = [true, choosingId, receiverPhoneNumber, inviteTime];

											conn.query(sql, params, function(error, rows, fields){
												if(error){
													console.log(error);
												}else{
			                      res.send("Invite");
												}
											});




									}
					}
			});

});


/* GET home page. */
router.get(['/:choosingId/:receiverPhoneNumber'], function(req, res, next) {
	 var choosingId = req.params.choosingId;
	 var receiverPhoneNumber = req.params.receiverPhoneNumber;


	 var sql = "SELECT _invitingId, _isConnection, InviteTime FROM INVITE_USER WHERE _choosingId = ? AND ReceiverPhoneNumber = ?";

	 var params = [choosingId, receiverPhoneNumber];


	 conn.query(sql, params, function(error, rows, fields){
		 if(error){
			 console.log(error);
		 }else{
			 if(!rows.length){
				 res.send("Error");
			 }else{
			 	 var result = "";


				 for(var i=0;i<rows.length; i++){
					 result += rows[i]._invitingId + "/" + rows[i]._isConnection + "/" + rows[i].InviteTime + "\n";
				 }

				 res.send(result);
			 }
		 }

	 });


});


module.exports = router;
