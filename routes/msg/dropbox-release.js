var express = require('express');
var router = express.Router();

/******************************
 *          route             *
 ******************************/
router.get('/', function (req, res, next){
    // redirect download link
    res.redirect('https://www.dropbox.com/sh/6km9zercq8c87yx/AAA73VJNraeRjrcNUheG9mj3a?dl=0');
});

module.exports = router;
