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

// https://github.com/plusfriend/auto_reply#51-home-keyboard-api
// Home Keyboard API
router.get(['/keyboard'], function(req, res, next){
	var resultObject = new Object();

	resultObject.type = "buttons";

	//var buttonArray = ["1", "2", "3"];
	var buttonArray = new Array();

	buttonArray.push("안녕");
	buttonArray.push("도와줘");
	buttonArray.push("참여");

	resultObject.buttons = buttonArray;

	var resultJson = JSON.stringify(resultObject);

	res.send(resultJson);
});

// 메시지 수신 및 자동응답 API
router.post(['/message'], function(req, res, next){
	var user_key = req.body.user_key;
	var type = req.body.type;
	var content = req.body.content;

	console.log("user_key : " + user_key);

	var resultObject = new Object();
	var messageObject = new Object();
	var text = "";

	if(content == "안녕"){
		text = "안녕하세요~";
	}else if(content == "도와줘"){
		text = "미구현 사항입니다.";
	}else if(content == "참여"){
		text = "참여해주셔서 감사합니다."
	}

	messageObject.text = text;

	var photoObject = new Object();

	var url = "https://photo.src";
	var width = 640;
	var height = 480;

	photoObject.url = url;
	photoObject.width = width;
	photoObject.height = height;
	messageObject.photo =  photoObject;

	var messageButtonObject = new Object();

	var label = "구글 설문지";
	var url = "https://www.korchid.com";

	messageButtonObject.label = label;
	messageButtonObject.url = url;

	messageObject.message_button = messageButtonObject;

	resultObject.message = messageObject;

	var keyboardObject = new Object();

	keyboardObject.type = "buttons";

	var buttonArray = new Array();

	buttonArray.push("안녕");
	buttonArray.push("도와줘");
	buttonArray.push("참여");

	keyboardObject.buttons = buttonArray;

	resultObject.keyboard = keyboardObject;

	var resultJson = JSON.stringify(resultObject);

	res.send(resultJson);
});


// 친구 추가 알림 API
router.post(['/friend'], function(req, res, next){
	var user_key = req.body.user_key;

	console.log("user_key : " + user_key);

	res.send("SUCCESS");
});

// 친구 차단 알림 API
router.delete(['/friend/:user_key'], function(req, res, next){
	var user_key = req.params.user_key;

	console.log("user_key : " + user_key);

	res.send("SUCCESS");
});


// 채팅방 나가기
router.delete(['/chat_room/:user_key'], function(req, res, next){
	var user_key = req.params.user_key;

	console.log("user_key : " + user_key);

	res.send("SUCCESS");
});



module.exports = router;
