
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
          var userId = results_user.insertId;

          db_sql.insert_user_information_id(userId, function(error, results_insert_information){
            if(error){
              callback(true, results_insert_information);
            }else{
              db_sql.insert_user_setting_id(userId, function(error, results_insert_setting){
                if(error){
                  callback(true, results_insert_setting);
                }else{
                  callback(null, results_insert_setting);
                }
              });
            }
          });
				}
			});
		}
	});

};

exports.login = function(phoneNumber, password, callback){
  //console.log("app_login");
  //console.log("phoneNumber : " + phoneNumber + ", password : " + password);
  db_sql.select_user_phone_number(phoneNumber, function(error, results_login){
    if(error){
      //console.log("error : " + error);
      callback(true, results_login);
    }else{
      //console.log(results_login);
      try {
        var password_sn = results_login[0].password_sn;

        if(password_sn == password){
          callback(null, results_login);
        }else{
          callback(null, null);
        }
      } catch (e) {
        callback(null, null);
      } finally {


      }

    }

  });
};

exports.duplicate_check = function(phoneNumber, callback){
  db_sql.select_user_phone_number(phoneNumber, function(error, results_duplicate_check){
    if(error){
      //console.log("error : " + error);
      callback(true, results_duplicate_check);
    }else{
      callback(null, results_duplicate_check);
    }
  });
};

exports.load_user = function(userId, callback){
  //console.log('load_user_setting');
  db_sql.select_user_all_data(userId, function(error, results_error){
    if(error){
      //console.log(error);
      callback(true, results_error);
    }else{
      callback(null, results_error);
    }
  });
};

exports.register_user_information = function(userId, nickname, sex, birthday, profile, callback){
  //console.log("register_user_setting");

  db_sql.select_user_information(userId, function(error, results_check){
    if(error){
      callback(true, results_check);
    }else{
      //console.log(results_check[0]);
      if(results_check[0] == undefined){
        db_sql.insert_user_information(userId, nickname, sex, birthday, profile, function(error, results_insert){
          if(error){
            //console.log(error);
            callback(true, results_insert);
          }else{
            callback(null, results_insert);
          }
        });
      }else{
        db_sql.update_user_information(userId, nickname, sex, birthday, profile, function(error, results_update){
          if(error){
            //console.log(error);
            callback(true, results_update);
          }else{
            callback(null, results_update);
          }
        });
      }
    }
  });
};


exports.load_user_information = function(userId, callback){
  //console.log('load_user_setting');
  db_sql.select_user_information(userId, function(error, results_error){
    if(error){
      //console.log(error);
      callback(true, results_error);
    }else{
      callback(null, results_error);
    }
  });
};


exports.delete_setting = function(userId, callback){
  db_sql.delete_user_setting(userId, function(error, results_delete){
    if(error){
      //console.log(error);
      callback(true, results_delete);
    }else{
      callback(null, results_delete);
    }
  });
};


exports.register_user_setting = function(userId, messageAlert, reserveEnable, reserveAlert, weekNumber, reserveNumber, callback){
  //console.log("register_user_setting");

  db_sql.select_user_setting(userId, function(error, results_check){
    if(error){
      callback(true, results_check);
    }else{
      console.log(results_check[0]);
      if(results_check[0] == undefined){
        db_sql.insert_user_setting(userId, messageAlert, reserveEnable, reserveAlert, weekNumber, reserveNumber, function(error, results_insert){
          if(error){
            //console.log(error);
            callback(true, results_insert);
          }else{
            callback(null, results_insert);
          }
        });
      }else{
        db_sql.update_user_setting(userId, messageAlert, reserveEnable, reserveAlert, weekNumber, reserveNumber, function(error, results_insert){
          if(error){
            //console.log(error);
            callback(true, results_insert);
          }else{
            callback(null, results_insert);
          }
        });
      }
    }
  });

};

exports.load_user_setting = function(userId, callback){
  //console.log('load_user_setting');
  db_sql.select_user_setting(userId, function(error, results_error){
    if(error){
      //console.log(error);
      callback(true, results_error);
    }else{
      callback(null, results_error);
    }
  });
};


exports.delete_setting = function(userId, callback){
  db_sql.delete_user_setting(userId, function(error, results_delete){
    if(error){
      //console.log(error);
      callback(true, results_delete);
    }else{
      callback(null, results_delete);
    }
  });
};
