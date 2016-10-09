var express = require('express');
var router = express.Router();

var request = require('request');

var xml2js = require('xml2js');
var parser = new xml2js.Parser();



/* GET home page. */
router.get(['/', '/:id'], function(req, res, next) {

	url = 'http://localhost:7579/mobius-yt/Sajouiot03/camera?rcn=4&lim=1'
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
  					//console.log(result);
						sResult = JSON.stringify(result);
						oResult = JSON.parse(sResult);

						var cin = oResult['m2m:rsp']['m2m:cin'];
						var image = cin[0]['con'][0];

						res.render('camera', {title:"Place of Chatting", image:image});
					});

			}
		});
});

module.exports = router;
