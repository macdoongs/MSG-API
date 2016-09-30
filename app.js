var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var topics = require('./routes/topics');
var iot = require('./routes/iot');
var chat = require('./routes/chat');
var rooms = require('./routes/rooms');
var sensor = require('./routes/sensor');
//var login = require('./routes/login');
var camera = require('./routes/camera');
var sign_in = require('./routes/sign-in');
var signup = require('./routes/signup');
var streaming = require('./routes/streaming');

var config = require('config.json')('./config/config.json');

var app = express();

var mysql = require('mysql');
var conn = mysql.createConnection({
	host      : config.rds.host,
	user      : config.rds.user,
	password  : config.rds.password,
	database  : config.rds.webdatabase
});

conn.connect();


console.log("My webpage start!");

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static(path.join(__dirname, 'jquery-mobile')));
app.use(express.static(path.join(__dirname, 'bootstrap-3.3.4-dist')));

app.use('/', routes);
app.use('/users', users);
app.use('/topics', topics);
app.use('/iot', iot);
app.use('/chat', chat);
app.use('/rooms', rooms);
app.use('/sensor', sensor);
//app.use('/login', login);
app.use('/sign-in', sign_in);
app.use('/signup', signup);
app.use('/camera', camera);
app.use('/streaming', streaming);



var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;

app.use(passport.initialize());
//app.use(passport.session());

//var session = passport.session();

// passport.use(new LocalStrategy({
//     usernameField: 'email',
//     passwordField: 'password'
// }, function( email, password, done){
//     User.findOne({
//         where: {
//             email: email
//         }
//     }).then(function( user ){
//         if(!user){
//             return done(null, false);
//         }
//         if(user.password !== password){
//             return done(null, false);
//         }
//         return done(null, user);
//     }).catch(function( err ){
//         done(err, null);
//     });
// }));

passport.use(new LocalStrategy({
        usernameField : 'userid',
        passwordField : 'password',
        passReqToCallback : true
    }
    ,function(req,userid, password, done) {
        if(userid=='asdf' && password=='asdf'){
            var user = { 'userid':'asdf',
                          'email':'asdf@naver.com'};
            return done(null,user);
        }else{
            return done(null,false);
        }
    }
	));

app.use(passport.session({
    secret: 'keyboard cat',
    proxy: true,
    resave: true,
    saveUninitialized: true,
    cookie: { secure: true }
}));


// serialize
// 인증후 사용자 정보를 세션에 저장
passport.serializeUser(function(user, done) {
    console.log('serialize');
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

function ensureAuthenticated(req, res, next) {
    // 로그인이 되어 있으면, 다음 파이프라인으로 진행
    if (req.isAuthenticated()) { return next(); }
    // 로그인이 안되어 있으면, login 페이지로 진행
    res.redirect('/login');
}

app.post('/login',
    passport.authenticate('local', { failureRedirect: '/login_fail', failureFlash: true }),
    function(req, res) {
        res.redirect('/login_success');
});

app.get('/login', function(req, res, next) {

			//console.log('chat _ ROOMID : ' + global.ROOMID);
			res.render('login', { title: 'Ajou IoT', message : 'message'});

});

app.post('/local-login', passport.authenticate('local', {

    successRedirect: '/userinfo', // 로그인 성공 Redirect URL
    failureRedirect: '/login', // 로그인 실패 Redirect URL
}));

app.get('/userinfo', function(req, res, next){

    var isLogin = req.isAuthenticated();
    console.log( isLogin );

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
    callbackURL: "https://www.korchid.com/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
			// if (!user) {
      //     // make a new google profile without key start with $
      //     var new_profile = {}
      //     new_profile.id = profile.id
      //     new_profile.displayName = profile.displayName
      //     new_profile.emails = profile.emails
      //     user = new User({
      //         name: profile.displayName
      //       , email: profile.emails[0].value
      //       , username: profile.username
      //       , provider: 'google'
      //       , google: new_profile._json
      //     })
      //     user.save(function (err) {
      //       if (err) console.log(err)
      //       return done(err, user)
      //     })
      //   } else {
      //     return done(err, user)
      //   }
			console.log(user);
      return cb(err, user);
    });
  }
));

app.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    //res.redirect('/');
		res.send(req.user);
  });

/*
	passport.use(new FacebookStrategy({
	    clientID: '174418527246196',
	    clientSecret: 'e70790dbdf575043408e1d12a3571f34',
	    callbackURL: "https://www.korchid.com/auth/facebook/callback"
	  },
	  function(accessToken, refreshToken, profile, cb) {
	    User.findOrCreate({ facebookId: profile.id }, function (err, user) {
				console.log(user);
	      return cb(err, user);
	    });
	  }
	));


	app.get('/auth/facebook',
	  passport.authenticate('facebook'));

	app.get('/auth/facebook/callback',
	  passport.authenticate('facebook', { failureRedirect: '/login' }),
	  function(req, res) {
	    // Successful authentication, redirect home.
	    res.redirect('/');
	  });

		passport.use(new TwitterStrategy({
		    consumerKey: 'TWITTER_CONSUMER_KEY',
		    consumerSecret: 'TWITTER_CONSUMER_SECRET',
		    callbackURL: "http://www.example.com/auth/twitter/callback"
		  },
		  function(token, tokenSecret, profile, done) {
		    User.findOrCreate({ twitterId: profile.id }, function(err, user) {
		      if (err) { return done(err); }
		      done(null, user);
		    });
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
		  passport.authenticate('twitter', { successRedirect: '/',
		                                     failureRedirect: '/login' }));
*/
app.get('/logout', function(req, res){
	req.logout();
	res.redirect('/');
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
