var express = require('express');
var router = express.Router();
var config = require('config.json')('./config/config.json');

var request = require('request');

var xml2js = require('xml2js');
var parser = new xml2js.Parser();

var gcm = require('node-gcm');

var redis = require('redis');

client = redis.createClient(config.redis.port, config.redis.host);
client.auth(config.redis.password);


router.use(function(req,res,next){
      req.cache = client;
      next();
});


/******************************
 *          route             *
 ******************************/
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

	var key = phoneNumber;
	var value = authCode;

	req.cache.set(key, value,function(err, data){
			 if(err){
						 console.log(err);
						 res.send("error " + err);
						 return;
			 }
			 //console.log(key);
			 //console.log(value);
			 req.cache.expire(key, 300);

	});

	res.send("OK");
});


router.get(['/'], function(req, res, next) {

});


module.exports = router;
