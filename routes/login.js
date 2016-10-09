var express = require('express');
var router = express.Router();

var request = require('request');

/* GET home page. */
router.get(['/', '/:id'], function(req, res, next) {

	res.render('login', { title: 'Place of Chatting'});
});

module.exports = router;
