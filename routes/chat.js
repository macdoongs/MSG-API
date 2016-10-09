var express = require('express');
var router = express.Router();

var request = require('request');


/* GET home page. */
router.get(['/', '/:id'], function(req, res, next) {
	var topicId = req.params.id;

	console.log('session : ' + req.session);

	res.render('chat', { title: 'Place of Chatting', id:topicId});

});

module.exports = router;
