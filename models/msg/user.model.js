
// sign with default (HMAC SHA256)
var jwt = require('jsonwebtoken');

var bcrypt = require('bcryptjs');

var db_sql = require('./sql_action');

var config = require('config.json')('./config/config.json');

var secretKey = config.jwt.secretKey;

const saltRounds = 10;

exports.duplicate_check = function(phoneNumber, callback){
  db_sql.select_user_phone_number(phoneNumber, function(error, results_duplicate_check){
    var resultObject = new Object();

    resultObject.phoneNumber = phoneNumber;

    if(error){
      //console.log("error : " + error);
      callback(true, results_duplicate_check);
    }else{
      //console.log(results_duplicate_check);
      if(results_duplicate_check.length > 0){
        resultObject.duplicate = true;
      }else{
        resultObject.duplicate = false;
      }


      var resultJson = JSON.stringify(resultObject);

      callback(null, resultJson);
    }
  });
};


exports.signup = function(phoneNumber, password, callback){
  console.log("signup");

  var resultObject = new Object();

  trimUserInput(phoneNumber, function(trimmedPhoneNumber){
    resultObject.phoneNumber = trimmedPhoneNumber;

    db_sql.select_user_phone_number(trimmedPhoneNumber, function(error, results_select){
  		if(error){
        resultObject.duplicate = false;
        resultObject.signup = false;

        var resultJson = JSON.stringify(resultObject);

  			console.log("error : " + results_select);
  			callback(true, results_select);
  		}else{
         if(results_select.length > 0){
           resultObject.duplicate = true;
           resultObject.signup = false;
           resultObject.setting = false;
           resultObject.information = false;

           var resultJson = JSON.stringify(resultObject);

           callback(null, resultJson);
         }else{
            // bcrypt - password
            bcrypt.genSalt(saltRounds, function(error, salt){
             if(error){
              console.log(error);
             }else{
               bcrypt.hash(password, salt, function(error, hash){
                 db_sql.insert_user(trimmedPhoneNumber, hash, function(error, results_insert){
          				if(error){
                    resultObject.duplicate = false;
                    resultObject.signup = false;
                    resultObject.setting = false;
                    resultObject.information = false;

          					console.log("error : " + results_insert);

                    var resultJson = JSON.stringify(resultObject);

          					callback(true, resultJson);
          				}else{
                    resultObject.duplicate = false;
                    resultObject.signup = true;

                    var userId = results_insert.insertId;

                    console.log('userId : ' + userId);

                    db_sql.insert_user_setting_id(userId, function(error, result_insert_setting){
                      if(error){
                        resultObject.setting = false;
                        resultObject.information = false;

                        var resultJson = JSON.stringify(resultObject);

                        callback(true, resultJson);

                      }else{
                        resultObject.setting = true;

                        db_sql.insert_user_information_id(userId, function(error, result_insert_setting){
                          if(error){

                            resultObject.information = false;

                            var resultJson = JSON.stringify(resultObject);

                            callback(true, resultJson);
                          }else{

                            resultObject.information = true;

                            var resultJson = JSON.stringify(resultObject);

                            callback(null, resultJson);
                          }
                        });
                      }
                    });
          				}
          			 });
               });
             }

           });

        }
  		}

  	});
  });

};

exports.login = function(phoneNumber, password, callback){
  //console.log("app_login");
  //console.log("phoneNumber : " + phoneNumber + ", password : " + password);
  trimUserInput(phoneNumber, function(trimmedPhoneNumber){
    db_sql.select_user_phone_number(trimmedPhoneNumber, function(error, results_login){
      var resultObject = new Object();

      resultObject.phoneNumber = trimmedPhoneNumber;

      if(error){
        console.log("error : " + results_login);
        callback(true, results_login);
      }else{
        //console.log(results_login);
        if(results_login.length > 0){
          resultObject.check_id = true;

          bcrypt.compare(password, results_login[0].password_ln , function(error, results_check){
            if(error){
              resultObject.login = false;
              resultObject.token = null;

              var resultJson = JSON.stringify(resultObject);

              callback(true, resultJson);
            }else{
              console.log(results_check);
              if(results_check){
                resultObject.login = true;

                var userId = results_login[0].user_id;

                var token = jwt.sign({
                  data: resultObject
                }, secretKey, { expiresIn: '1h' });

                console.log("token : " + token);

                jwt.verify(token, secretKey, function(err, decoded) {
                  console.log("data : " + decoded.data);
                });

                resultObject.token = token;

                var resultJson = JSON.stringify(resultObject);

                db_sql.insert_user_token(trimmedPhoneNumber, token, function(error, result_insert){
                  if(error){
                    callback(null, resultJson);
                  }else{
                    callback(true, resultJson);
                  }
                });

              }else{
                resultObject.login = false;
                resultObject.token = null;

                var resultJson = JSON.stringify(resultObject);
                callback(null, resultJson);
              }
            }
          });
        }else{
          resultObject.check_id = false;
          resultObject.login = false;
          resultObject.token = null;

          var resultJson = JSON.stringify(resultObject);

          callback(null, resultJson);
        }


      }

    });
  });
};

exports.trimUserInputData = function(userPhoneNumber, callback){
  trimUserInput(userPhoneNumber, function(results){
    callback(results);
  });
};

function trimUserInput(userPhoneNumber, callback){
	var input = userPhoneNumber;

	var trimmedPhoneNumberArray = input.split('-');
	var trimmedPhoneNumber = "";

	for(var i=0; i<trimmedPhoneNumberArray.length; i++){
		trimmedPhoneNumber += trimmedPhoneNumberArray[i];
	}

	callback(trimmedPhoneNumber);
}


exports.load_user = function(userId, callback){
  load_data(userId, function(error, result){
    if(error){
      callback(true, result);
    }else{
      callback(null, result);
    }
  });
};

function load_data (userId, callback){
  console.log("userId : " + userId);

  db_sql.select_user_all_data(userId, function(error, results_select){
    var resultObject = new Object();

    if(error){
      //console.log(error);
      callback(true, results_select);
    }else{

      if(results_select.length > 0){
        resultObject.load = true;

        var userObject = new Object();

        userObject.user_id = results_select[0].user_id;
        userObject.nickname_sn = results_select[0].nickname_sn;
        userObject.birthday_dt = results_select[0].birthday_dt;
        userObject.profile_ln = results_select[0].profile_ln;
        userObject.message_alert = results_select[0].message_alert;
        userObject.reserve_enable = results_select[0].reserve_enable;
        userObject.reserve_alert = results_select[0].reserve_alert;
        userObject.week_number = results_select[0].week_number;
        userObject.reserve_number = results_select[0].reserve_number;
        userObject.role_number = results_select.length;
      }else{
        resultObject.load = false;

        userObject = null;
      }
      resultObject.user = userObject;

      var resultJson = JSON.stringify(resultObject);

      callback(null, resultJson);
    }
  });
};

exports.register_user_information = function(loginToken, nickname, sex, birthday, profile, callback){
  //console.log("register_user_setting");

  db_sql.select_user_information(loginToken, function(error, results_check){
    if(error){
      callback(true, results_check);
    }else{
      console.log(results_check[0]);
      if(results_check[0] == undefined){
        db_sql.insert_user_information(loginToken, nickname, sex, birthday, profile, function(error, results_insert){
          if(error){
            //console.log(error);
            callback(true, results_insert);
          }else{
            callback(null, results_insert);
          }
        });
      }else{
        db_sql.update_user_information(loginToken, nickname, sex, birthday, profile, function(error, results_update){
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
