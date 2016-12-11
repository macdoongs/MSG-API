var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next){
    res.redirect('https://www.dropbox.com/sh/6km9zercq8c87yx/AAA73VJNraeRjrcNUheG9mj3a?dl=0');
});

module.exports = router;
