var express = require('express');
var router = express.Router();
var config = require('config.json')('./config/config.json');

var mysql = require('mysql');
var conn = mysql.createConnection({
	host      : config.rds.host,
	user      : config.rds.user,
	password  : config.rds.password,
	database  : config.rds.ajouiotdb
});

var request = require('request');

var xml2js = require('xml2js');
var parser = new xml2js.Parser();

var gcm = require('node-gcm');

/*
var topic = 'sms-auth';
var Sender = require('aws-sms-send');
var configAWS = {
  AWS: {
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
    region: config.aws.region
  },
  topicArn: config.aws.smstopic,
	//topicArn: "arn:aws:sqs:ap-northeast-2:604227386346:sms-queue"
};

var sender = new Sender(configAWS);
*/

router.post(['/'], function(req, res, next){
	var phoneNumber = req.body.phoneNumber;
	var token = req.body.token;

	var authCode = parseInt(Math.random() * 1000000);

		// or with object values
	var message = new gcm.Message({
	     collapseKey: 'msg_sms',
	     delayWhileIdle: true,
	     timeToLive: 3,
	     data: {
	          lecture_id : "notice",
	          title : "제목입니다",
	          desc : "설명입니다",
	          id : phoneNumber,
						code : authCode
	     },
			 notification: {
        title: "Hello, World",
        icon: "ic_launcher",
        body: "This is a notification that will be displayed ASAP."
    	}
	});

	var server_access_key = config.gcmsms.serverapikey;
	var sender = new gcm.Sender(server_access_key);
	var registrationIds = [ ];     // 여기에 pushid 문자열을 넣는다.

	registrationIds.push(token);

	console.log('token : ' + token);
	//registrationIds = ['/*안드로이드 단말기에서 나온 푸시 아이디*/'];

	/*
	for (var i=0; i<push_ids.length; i++) {
	     registrationIds.push(push_ids[i]);
	}
	*/

	// 푸시를 날린다!
	sender.send(message, registrationIds, 4, function (err, result) {
	     // 여기서 푸시 성공 및 실패한 결과를 준다. 재귀로 다시 푸시를 날려볼 수도 있다.
	     console.log('message : ' + message);
	});

	res.send("OK");
});


/* GET home page. */
router.get(['/:userid/:registerationId'], function(req, res, next) {
	var userid = req.params.userid;
	var registerationId = req.params.registerationId;


	var authCode = parseInt(Math.random() * 1000000);
	console.log(authCode);

		// or with object values
	var message = new gcm.Message({
	     collapseKey: 'msg_sms',
	     delayWhileIdle: true,
	     timeToLive: 3,
	     data: {
	          lecture_id:"notice",
	          title:"제목입니다",
	          desc: "설명입니다",
	          id:userid,
						code:authCode
	     },
			 notification: {
        title: "Hello, World",
        icon: "ic_launcher",
        body: "This is a notification that will be displayed ASAP."
    	}
	});

	var server_access_key = config.gcmsms.serverapikey;
	var sender = new gcm.Sender(server_access_key);
	var registrationIds = [ ];     // 여기에 pushid 문자열을 넣는다.

	registrationIds.push(registerationId);

	console.log('registerationId : ' + registerationId);
	//registrationIds = ['/*안드로이드 단말기에서 나온 푸시 아이디*/'];

	/*
	for (var i=0; i<push_ids.length; i++) {
	     registrationIds.push(push_ids[i]);
	}
	*/

	// 푸시를 날린다!
	sender.send(message, registrationIds, 4, function (err, result) {
	     // 여기서 푸시 성공 및 실패한 결과를 준다. 재귀로 다시 푸시를 날려볼 수도 있다.
	     console.log('message : ' + message);
	});

	res.send("OK");
	/*  // Create subscribe
	// sender.createSubscribe('+905054146201')
	// .then(function(response) {
	//   console.log(response);
	// })
	// .catch(function(err) {
	//    console.log(err)
	// });

	// Send topic sms
	// sender.sendSms('Sms body topic', 'Topic sms', true)
	// .then(function(response) {
	//   console.log(response);
	// })
	// .catch(function(err) {
	//    console.log(err)
	// });

	userid = '+821023680314';


	// Send direct sms
	sender.sendSms('616161', topic, false, userid)
	 .then(function(response) {
	   console.log(response);
	 })
	 .catch(function(err) {
	    console.log(err)
	 });
	 */

});


module.exports = router;
