var express = require('express');
var router = express.Router();

var request = require('request');


/* GET home page. */
router.get(['/', '/:userid/:roomid'], function(req, res, next) {
	var userid = req.params.userid;
	var roomid = req.params.roomid;

	console.log('session : ' + req.session);

	res.render('chat', { title: 'Place of Chatting', userid:userid, roomid:roomid});

});

module.exports = router;
