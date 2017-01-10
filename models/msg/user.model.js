
var db_sql = require('./sql_action');

exports.signup = function(phoneNumber, password, callback){
  console.log("signup");
  db_sql.select_user_phone_number(phoneNumber, function(error, results_user){
		if(error){
			console.log("error : " + error);
			callback(true, results_user);
		}else{
			db_sql.insert_user(phoneNumber, password, function(error, results_user){
				if(error){
					console.log("error : " + error);
					callback(true, results_user);
				}else{
					callback(null, results_user);
				}
			});
		}
	});

};

exports.app_login = function(phoneNumber, password, callback){
  //console.log("app_login");
  //console.log("phoneNumber : " + phoneNumber + ", password : " + password);
  db_sql.select_user_phone_number(phoneNumber, function(error, results_login){
    if(error){
      //console.log("error : " + error);
      callback(true, results_login);
    }else{
      //console.log(results_login);
      if(results_login[0].password_sn == password){
        callback(null, results_login);
      }
    }
  });
};

exports.load_user = function(userId, callback){
  //console.log('load_user_setting');
  db_sql.select_user_all(userId, function(error, results_error){
    if(error){
      //console.log(error);
      callback(true, results_error);
    }else{
      callback(null, results_error);
    }
  });
};
