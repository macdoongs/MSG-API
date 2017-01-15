var express = require('express');
var router = express.Router();
var config = require('config.json')('./config/config.json');

var mapping_model = require('../../../models/msg/mapping.model');


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


var crypto = require('crypto');

var key = config.crypto.key;      // 암호화, 복호화를 위한 키


var request = require('request');

var xml2js = require('xml2js');
var parser = new xml2js.Parser();


var FCM = require('fcm-push');

var serverKey = config.firebase.serverkey;
var fcm = new FCM(serverKey);

/******************************
 *          route             *
 ******************************/
router.post(['/'], function(req, res, next){
	var parentId = req.body.parentId;
	var childId = req.body.childId;
	var deviceToken = req.body.deviceToken;
	var topic = parentId + "_" + childId;


	mapping_model.map_user(parentId, childId, topic, function(error, results_map){
		if(error){
			res.send(results_map);
		}else{
			var message = {
		    to: deviceToken, // required fill with device token or topics
				collapse_key: 'your_collapse_key',
				data: {
		        your_custom_data_key: 'your_custom_data_value'
		    },
		    notification: {
		        title: 'Alert test',
		        body: 'hello'
		    }
			};

			//callback style
			fcm.send(message, function(err, response){
			    if (err) {
			        console.log("Something has gone wrong!");
			    } else {
			        console.log("Successfully sent with response: ", response);
			    }
			});
/*
			//promise style
			fcm.send(message)
		    .then(function(response){
		        console.log("Successfully sent with response: ", response);
		    })
		    .catch(function(err){
		        console.log("Something has gone wrong!");
		        console.error(err);
		    })
*/
			res.send(results_map);

		}
	});

});


/* GET home page. */
router.get(['/me/:userId/myRole/:userRole'], function(req, res, next) {
		var userId = req.params.userId;
		var userRole = req.params.userRole;

		mapping_model.load_map_user(userId, userRole, function(error, results_map){
			if(error){
	      res.send(results_map);
	    }else{
	      res.send(results_map);
	    }
		});

});


module.exports = router;
