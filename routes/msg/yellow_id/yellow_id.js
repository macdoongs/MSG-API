var express = require('express');
var router = express.Router();
var config = require('config.json')('./config/config.json');

var yellow_id = require('../../../models/msg/yellow_id.model');

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
	buttonArray.push("참여");
	buttonArray.push("도와줘");

	resultObject.buttons = buttonArray;

	var resultJson = JSON.stringify(resultObject);

	res.send(resultJson);
});

// 메시지 수신 및 자동응답 API
router.post(['/message'], function(req, res, next){
	var userKey = req.body.user_key;
	var type = req.body.type;
	var content = req.body.content;

	//console.log("user_key : " + user_key);
	//console.log("type : " + type);
	//console.log("content : " + content);

	yellow_id.register_yellow_id_message(userKey, type, content, function(error, result){
		console.log(result);
	});


	var resultObject = new Object();
	var messageObject = new Object();
	var text = "";
	var isTherePhoto = false;
	var isThereLink = false;
	var isThereNextMessage = false;

	if(content == "안녕~"){
		text = "안녕하세요. ‘부모생각’입니다. ‘부모생각’은 부모/자녀 간 발생하는 상호작용(대화, 생신, 용돈, 선물 등) 전반을 케어하며 부모 자녀의 소통을 원활하게 해 친밀도를 증진시키는 서비스입니다.";
	}else if(content == "뭘 도와주는데?"){
		text = "1. 부모님 관심 콘텐츠 전송\n부모님의 관심(예 골프, 음악 등)콘텐츠를 추천하여 자녀가 전송 할 수 있도록 콘텐츠를 보내드립니다. \n" +
					"2. 전화 알림\n전화하고 싶은 시간을 설정하면 설정한 시간에 전화하라는 알림을 드립니다." +
					"3. 메시지 전송\n메시지 문구를 선택(or 직접 입력도 가능)하면 선택한(작성한) 메시지가 적절한 시간에 전송될수 있도록 알림을 드립니다. \n" +
					"(예 : 내일 영하 10도로 매우 춥다네요. 엄마 옷 따뜻하게 입어요~ → 전날 저녁 / 엄마 식사 하셨어요? → 식사시간)\n" +
					"4. 생신, 기념일 알림\n 부모님 생신,기념일 2주전/1주전/당일 알림을 드립니다.";
	}else if(content == "신청"){
		text = "신청해주셔서 감사합니다. 모집이 끝난 후 다시 찾아뵙겠습니다.";
		/*
		text = "참여해주셔서 감사합니다. 다음 설문에 답해주시면 이후 맞춤 서비스를 제공해드리겠습니다.";
		isThereLink = true;
		*/
	}

	messageObject.text = text;

	if(isTherePhoto){
		var photoObject = new Object();

		var url = "https://photo.src";
		var width = 640;
		var height = 480;

		photoObject.url = url;
		photoObject.width = width;
		photoObject.height = height;
		messageObject.photo =  photoObject;
	}

	if(isThereLink){
		var messageButtonObject = new Object();

		var label = "구글 설문지";
		var url = "https://www.korchid.com";

		messageButtonObject.label = label;
		messageButtonObject.url = url;

		messageObject.message_button = messageButtonObject;
	}

	resultObject.message = messageObject;

	if(isThereNextMessage){
		var keyboardObject = new Object();

		keyboardObject.type = "buttons";

		var buttonArray = new Array();

		buttonArray.push("안녕");
		buttonArray.push("도와줘");
		buttonArray.push("참여");

		keyboardObject.buttons = buttonArray;

		resultObject.keyboard = keyboardObject;
	}

	var resultJson = JSON.stringify(resultObject);

	res.send(resultJson);
});


// 친구 추가 알림 API
router.post(['/friend'], function(req, res, next){
	var user_key = req.body.user_key;
	//console.log("user_key : " + user_key);

	yellow_id.insert_kakao_user_key(user_key, function(error, result_insert){
		if(error){
			res.send(result_insert);
		}else{
			res.send(result_insert);
		}
	});

	//res.send("SUCCESS");
});

// 친구 차단 알림 API
router.delete(['/friend/:user_key'], function(req, res, next){
	var user_key = req.params.user_key;
	//console.log("user_key : " + user_key);

	res.send("SUCCESS");
});


// 채팅방 나가기
router.delete(['/chat_room/:user_key'], function(req, res, next){
	var user_key = req.params.user_key;
	//console.log("user_key : " + user_key);

	res.send("SUCCESS");
});



module.exports = router;
