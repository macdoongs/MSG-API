var express = require('express');
var router = express.Router();
var config = require('config.json')('./config/config.json');

var request = require('request');

var xml2js = require('xml2js');
var parser = new xml2js.Parser();

var chat_model = require('../../models/msg/chat.model');


/******************************
 *          route             *
 ******************************/
router.post(['/'], function(req, res, next){
		var senderId = req.body.senderId;
		var receiverId = req.body.receiverId;

		chat_model.load_chat(senderId, receiverId, function(error, results_load_chat){
			if(error){
				res.send(results_load_chat);
			}else{
				res.send(results_load_chat);
			}
		});
});


router.get(['/'], function(req, res, next) {
});


module.exports = router;
