var express = require('express');
var router = express.Router();

var request = require('request');

var xml2js = require('xml2js');
var parser = new xml2js.Parser();

var aeid = "";

/* GET home page. */
router.get(['/', '/:userid/:roomid'], function(req, res, next) {
	var userid = req.params.userid;
	var roomid = req.params.roomid;
	aeid = roomid;

	url = 'http://' + mobiushost + ':' + usecsebaseport + '/' + usecsebase + '/'+ aeid + '/arduino?rcn=4&lim=10';
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

					parser.parseString(body, function(err, result) {
  					//console.log('result : ' + result);
						sResult = JSON.stringify(result);
						oResult = JSON.parse(sResult);

						try{
							var cin = oResult['m2m:rsp']['m2m:cin'];
							var data = cin[0]['con'][0];
						}catch(exception){
							console.log(exception);
							res.send('No data!');
						}

						//console.log("data" + data);

						res.render('sensor', {title:"Place of Chatting", userid:userid, roomid:roomid, data:data})
					});

			}
		});
});


module.exports = router;
