var express = require('express');
var router = express.Router();
var config = require('config.json')('./config/config.json');

var util = require('util');

var mqtt = require('mqtt');

var mysql = require('mysql');
var conn = mysql.createConnection({
	host      : config.rds.host,
	user      : config.rds.user,
	password  : config.rds.password,
	database  : config.rds.iotdatabase
});

var request = require('request');

var xml2js = require('xml2js');
var parser = new xml2js.Parser();

conn.connect();

var sh_timer = require('./timer');



/* GET home page. */
router.get(['/', '/:id'], function(req, res, next) {
  var myName = config.rds.user;
	var topicId = "test-topic";
	var topicSeq = null;
	var mqtt_client = config.iot.mqttproxy;

	url = 'http://localhost:7579/mobius-yt/Sajouiot01/beacon01?rcn=4&lim=8'
	request({
     		url : url,
     		method: 'GET',
     		headers : {
      			'Accept':'application/xml',
      			'X-M2M-RI': '12345',
      			'X-M2M-Origin': 'SOrigin',
						'nmtype':'short'    },
		//qs: {'query' : text}
   	}, function(error, response, body) {
    		if(error) {
      			console.log(error);
    		}else{
					var conArr = new Array();

					//console.log('Mobius request Ok!');

					parser.parseString(body, function(err, result){
						sResult = JSON.stringify(result);
						oResult = JSON.parse(sResult);

						//console.log(Object.keys(oResult['m2m:rsp']['m2m:cin'][0]));
						//var cin = Object.keys(oResult['m2m:rsp']['m2m:cin']);
						var cin = oResult['m2m:rsp']['m2m:cin'];
						var cinLen = Object.keys(cin).length;

						//console.log('cin : ' + cin);
						//console.log(cinLen);
						//console.log('oResult-con : ' + oResult['m2m:rsp']['m2m:cin'][0]['con']);

						global.rooms = new Array();

						for(var i=0; i < cinLen; i++){
							//console.log('cin['+ i + '] : ' + cin[i]);
							//console.log(cin[i]['con']);
							var sptArr = cin[i]['con'][0].split(',');
							//console.log(i + ' con : ' + sptArr[0]);
							var nameCheck = 0;
							if(sptArr[0].substring(0, 6) != 'beacon'){
								continue;
							}
							for(var j=0; j<conArr.length; j++){
								if(conArr[j] == sptArr[0]){
									nameCheck++;
									break;
								}
							}
							if(nameCheck){
							}else{
								global.rooms.push(sptArr[0]);
								conArr.push(sptArr[0]);
							}
						}
						//console.log(conArr);

						res.render('rooms', { title: 'AjouIoT', id:topicId , rooms : conArr});

					});

			}
		});
});

module.exports = router;
