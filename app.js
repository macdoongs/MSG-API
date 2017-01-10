var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var config = require('config.json')('./config/config.json');

var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var redis = require('redis');
var morgan = require('morgan');

var fs = require('fs');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;

var app = express();



var logDirectory = './log';

// ensure log directory exists
if (!fs.existsSync(logDirectory)){
    fs.mkdirSync(logDirectory);
}

var FileStreamRotator = require('file-stream-rotator');

// create a rotating write stream
var accessLogStream = FileStreamRotator.getStream({
    date_format: 'YYYYMMDD',
    filename: logDirectory + '/access-%DATE%.log',
    frequency: 'daily',
    verbose: false
});


// setup the logger
//app.use( morgan('combined', {stream: accessLogStream}));
app.use( morgan('dev', {stream: accessLogStream}));

var mysql = require('mysql');

var index = require('./routes/web/index');

var dropbox_release = require('./routes/msg/dropbox-release');
var sms_sender = require('./routes/msg/auth/sms/send');
var sms_check = require('./routes/msg/auth/sms/check');
var msg_mapping = require('./routes/msg/user/mapping');
var msg_error = require('./routes/msg/error');
var msg_user = require('./routes/msg/user/user');
var msg_reservation = require('./routes/msg/user/reservation');
var msg_chatting = require('./routes/msg/user/chatting');
var msg_recovery_password = require('./routes/msg/user/recovery/password');
var msg_invitation = require('./routes/msg/user/invitation');




//console.log("My webpage start!");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'dist')));

// Web page
app.use('/', index);
app.use('/release/dropbox', dropbox_release);
app.use('/dropbox-release', dropbox_release);

// Android
app.use('/msg/sms/sender', sms_sender);
app.use('/msg/sms/check', sms_check);
app.use('/msg/mapping', msg_mapping);
app.use('/msg/error', msg_error);
app.use('/msg/user', msg_user);
app.use('/msg/user/recovery/password', msg_recovery_password);
app.use('/msg/reservation', msg_reservation);
app.use('/msg/chatting', msg_chatting);
app.use('/msg/invitation', msg_invitation);

//app.use(session({ secret: 'SECRET' }));
//var session = passport.session();


app.use(session({
	  store: new RedisStore({
	    port: config.redis.port,
	    host: config.redis.host,
	    db: config.redis.db,
	    pass: config.redis.password
	  }),
	  secret: 'korchid',
	  proxy: true,
		resave: true,
		expires: false,
    saveUninitialized: true,
	  cookie: { secure: true }
	}));

app.use(passport.initialize());
app.use(passport.session());
/*
app.use(passport.session({
		store: new RedisStore({
			port: config.redis.port,
			host: config.redis.host,
			db: config.redis.db,
			pass: config.redis.password
		}),
		secret: 'korchid',
		proxy: true,
		resave: true,
		expires: false,
		saveUninitialized: true,
		cookie: { secure: true }
	}));
*/


// serialize
// 인증후 사용자 정보를 세션에 저장
passport.serializeUser(function(user, done) {
    console.log('serialize');

		try{
			var id = user.id;
			var provider = user.provider;
			if(provider == undefined){
				provider = 'local';
			}
		}catch(exception){
			console.log(exception);
		}

		console.log('id : ' + id);
		console.log('provider : ' + provider);

    done(null, user);
});



// deserialize
// 인증후, 사용자 정보를 세션에서 읽어서 request.user에 저장
passport.deserializeUser(function(user, done) {

		//findById(id, function (err, user) {
    console.log('deserialize');
    done(null, user);
    //});
});


client = redis.createClient(config.redis.port, config.redis.host);
client.auth(config.redis.password);

app.use(function(req,res,next){
      req.cache = client;
      next();
});

// function ensureAuthenticated(req, res, next) {
//     // 로그인이 되어 있으면, 다음 파이프라인으로 진행
//     if (req.isAuthenticated()) {
// 			return next();
// 		}
//     // 로그인이 안되어 있으면, login 페이지로 진행
//     res.redirect('/login');
// }

app.post('/login', passport.authenticate('local', { failureRedirect: '/login_fail', failureFlash: true }),
    function(req, res) {
				console.log(req.session);
				//req.session.key = req.session.passport.user.id;
				//console.log(req.session.key);
        res.redirect('/login_success');
});

app.get(['/login', '/login/:userid'], function(req, res, next) {
			var userid = req.params.userid;



			console.log('session : ' + req.session);

			res.render('login', { title: 'Place of Chatting', userid:userid});
});

app.post('/local-login',
		passport.authenticate('local'), function(req, res){
		console.log('local-login');
		if (req.isAuthenticated()) {
				console.log('session : ' + req.session);
				console.log(Object.keys(req.session));

				//console.log('session : ' + req.session.passport);

				//res.redirect('/login_success');

				var key = req.user.id;

	      var value = 'local';

				req.session.id = key;
				req.session.provider = value;

				console.log('session id :', req.session.id);

	      req.cache.set(key,value,function(err,data){
	           if(err){
	                 console.log(err);
	                 res.send("error "+err);
	           }else{
							 		 console.log(key);
									 //req.cache.expire(key, 1800);
						 }
	      });

				res.send('Login Success!');
		}else{
			res.redirect('/login_fail');
		}
});

//app.get('/login_success',  ensureAuthenticated, function(req, res, next) {
app.get('/login_success',  function(req, res, next) {
			//console.log('Login Success : ' + req.user);
			console.log('session : ' + req.session);
			//console.log(req.session.key);
			//console.log('Session : ' + req.session);
			//console.log(Object.keys(req.session));

			res.send('Login Success!');

});


app.get('/login_fail', function(req, res, next) {
		res.send('Login Fail');
});

passport.use(new LocalStrategy({
        usernameField : 'id',
        passwordField : 'password',
        passReqToCallback : true
    }
    ,function(req, id, password, done) {
				console.log('LocalStrategy');

        //if(id=='asdf' && password=='asdf'){
            var user = { 'id':id,
                          'password':password};
            return done(null,user);
        //}else{
        //    return done(null,false);
        //}
    }
	));



app.get('/userinfo', function(req, res, next){

    var isLogin = req.isAuthenticated();
    console.log( isLogin );
		console.log('session : ' + req.session);

		console.log(req.user);
		res.send(req.user);
		//var userid = req.user.userid;
    //console.log('User id is '+ userid);

    //var email = req.user.email;
    //console.log('User Email is '+ email);
});

passport.use(new GoogleStrategy({
    clientID: '1067670564214-2e217fhtiisjhlqtll5hhi4gmksioi20.apps.googleusercontent.com',
    clientSecret: 'UPA0_oWAmXgDTbtkW8X1--X6',
    callbackURL: 'https://www.korchid.com/auth/google/callback'
  },
  function(accessToken, refreshToken, profile, cb) {
		console.log('GoogleStrategy');
		console.log(profile);
		return cb(null, profile);
    // profile.findOrCreate({ googleId: profile.id }, function (err, user) {
		// 	if (!user) {
    //       // make a new google profile without key start with $
		// 			console.log(user);
    //       var new_profile = {}
    //       new_profile.id = profile.id
    //       new_profile.displayName = profile.displayName
    //       new_profile.emails = profile.emails
    //       user = new User({
    //           name: profile.displayName
    //         , email: profile.emails[0].value
    //         , username: profile.username
    //         , provider: 'google'
    //         , google: new_profile._json
    //       })
    //       user.save(function (err) {
    //         if (err) console.log(err)
    //         return done(err, user)
    //       })
    //     } else {
    //       return done(err, user)
    //     }
		// 	console.log(user);
    //   return cb(err, user);
    // });
  }
));


app.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

app.get('/auth/google/callback',
  passport.authenticate('google'),
  function(req, res) {
    // Successful authentication, redirect home
		if (req.isAuthenticated()) {
				console.log('session : ' + req.session);
				console.log(req.user);

				var key = req.user.id;
	      var value = req.user.provider;

	      req.cache.set(key,value,function(err,data){
	           if(err){
	                 console.log(err);
	                 res.send("error "+err);
	           }else{
							 		 console.log(key);
									 //req.cache.expire(key, 1800);
						 }
	      });

				//res.redirect('/login_success');
				res.redirect('/rooms/' + req.session.passport.user.id);
		}else{
			res.redirect('/login_fail');
		}
    //res.redirect('/');
		//res.send(req.user);
  });


	passport.use(new FacebookStrategy({
	    clientID: '1744185272461961',
	    clientSecret: 'e70790dbdf575043408e1d12a3571f34',
	    callbackURL: "https://www.korchid.com/auth/facebook/callback"
	  },
	  function(accessToken, refreshToken, profile, cb) {
			console.log('FacebookStrategy');
			console.log(profile);
			return cb(null, profile);
	    // User.findOrCreate({ facebookId: profile.id }, function (err, user) {
			// 	console.log(user);
	    //   return cb(err, user);
	    // });
	  }
	));


	app.get('/auth/facebook',
	  passport.authenticate('facebook'));

	app.get('/auth/facebook/callback',
	  passport.authenticate('facebook', { failureRedirect: '/login' }),  function(req, res) {
	    // Successful authentication, redirect home.
			if (req.isAuthenticated()) {
					console.log('session : ' + req.session);
					console.log(req.user);
					//res.redirect('/login_success');
					res.redirect('/rooms/' + req.session.passport.user.id);
			}else{
				res.redirect('/login_fail');
			}
	  });

		passport.use(new TwitterStrategy({
		    consumerKey: 'S8QClFieKug2cJhhZHBs0DmMt',
		    consumerSecret: 'K1ELWK3pUe0WjNKzchYl4u00J3aqHmRwxwyqnxaMCgC7mPdzJw',
		    callbackURL: "https://www.korchid.com/auth/twitter/callback"
		  },
		  function(token, tokenSecret, profile, done) {
				console.log('TwitterStrategy');
				console.log(profile);
				return done(null, profile);
				// User.findOrCreate({ twitterId: profile.id }, function(err, user) {
		    //   if (err) { return done(err); }
		    //   done(null, user);
		    // });
		  }
		));

		// Redirect the user to Twitter for authentication.  When complete, Twitter
		// will redirect the user back to the application at
		//   /auth/twitter/callback
		app.get('/auth/twitter', passport.authenticate('twitter'));

		// Twitter will redirect the user to this URL after approval.  Finish the
		// authentication process by attempting to obtain an access token.  If
		// access was granted, the user will be logged in.  Otherwise,
		// authentication has failed.
		app.get('/auth/twitter/callback',
		  passport.authenticate('twitter', { failureRedirect: '/login' }),	function(req, res) {
			// Successful authentication, redirect home.
			if (req.isAuthenticated()) {
					console.log('session : ' + req.session);
					console.log(req.user);
					//res.redirect('/login_success');
					res.redirect('/rooms/' + req.session.passport.user.id);
			}else{
				res.redirect('/login_fail');
			}
		});

app.get(['/logout', '/logout/:id'], function(req, res){

	var uid = req.params.id;

	try{
	console.log('Function - logout');
	console.log('uid : ' + uid);
	console.log(req.session);
	req.logout();
	//req.cache.del(uid);
	req.session.destroy();
	console.log('logout!');
	console.log(req.session);
}catch(exception){
	console.log(exception);
}
	res.clearCookie();
	res.redirect('/login');
	//res.redirect('https://accounts.google.com/logout');
});





// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
