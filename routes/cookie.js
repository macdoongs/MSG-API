exports.writecookie = function(req, res){
    res.cookie('name','terry',{ expires: new Date(Date.now() + 900000), httpOnly: true });
    // option  - signed:true - encryption
    res.end();
};

exports.readcookie = function(req, res){
    var name = req.cookies.name;
    // Read encryption cookies
    //var name = req.signedCookies.name;
    console.log("name cookie is :"+name);
    res.end();
}
