var express = require('express');
var router = express.Router();

var request = require('request');

/* GET home page. */
router.get(['/', '/:userid'], function(req, res, next) {
	var userid = req.params.userid;

	res.render('login', { title: 'Place of Chatting', userid:userid});
});

module.exports = router;
