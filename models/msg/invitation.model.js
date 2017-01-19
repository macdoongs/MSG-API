
var db_sql = require('./sql_action');



function invite_user (userId, receiverPhoneNumber, roleName, callback){
  //console.log("invite_user");
  //console.log("phoneNumber : " + phoneNumber + ", password : " + password);

  db_sql.select_role_id(roleName, function(error, results_role_id){
		if(error){
			console.log("error : " + error);
			callback(true, results_role_id);
		}else{
      var roleId = results_role_id[0].user_role_id;
      console.log("user_role_id : " + roleId);

      db_sql.select_user_choose_role(userId, roleId, function(error, results_role){
    		if(error){
    			console.log("error : " + error);
    			callback(true, results_role);
    		}else{
          try {
            var chooseRoleId = results_role[0].choose_role_id;
            console.log(chooseRoleId);
          } catch (e) {
            console.log("Error : " + e);
          } finally {

          }


          if(chooseRoleId == undefined){
            db_sql.insert_user_choose_role(userId, roleId, function(error, results_choose){
      				if(error){
      					console.log("error : " + error);
      					callback(true, results_choose);
      				}else{
                var chooseRoleId = results_choose.insertId;
                console.log("chooseRoleId : " + chooseRoleId);

      					db_sql.insert_user_invite_user(chooseRoleId, receiverPhoneNumber, function(error, results_invite){
                  if(error){
                    console.log("error : " + error);
                    callback(true, results_invite);
                  }else{
                    callback(null, results_invite);
                  }
                });
      				}
      			});
          }else{
            db_sql.insert_user_invite_user(chooseRoleId, receiverPhoneNumber, function(error, results_invite){
              if(error){
                console.log("error : " + error);
                callback(true, results_invite);
              }else{
                callback(null, results_invite);
              }
            });

          }
        }
	     });
     }
   });
}


exports.load_user_invite_user = function(senderId, receiverPhoneNumber, callback){
  db_sql.select_user_choose_role_id(senderId, receiverPhoneNumber, function(error, result_choose){
    if(error){
      callback(true, result_choose);
    }else{
      try {
        console.log(result_choose);
        var chooseRoleId = result_choose[1].choose_role_id;
      } catch (e) {
        console.log("Error : " + e);
      } finally {

      }
      db_sql.select_user_invite_user(chooseRoleId, receiverPhoneNumber, function(error, results_invite){
        if(error){
          callback(true, results_invite);
        }else{
          callback(null, results_invite);
        }
      });
    }
  });
};


exports.invite_user_connection = function(senderId, receiverPhoneNumber, roleName, callback){
  db_sql.select_connection_invite_user(senderId, receiverPhoneNumber, function(error, results_check){
    console.log('senderId : ' + senderId + ', receiverPhoneNumber : ' + receiverPhoneNumber);

    var resultObject = new Object();

    if(error){
      console.log(results_check);
      resultObject.sender = false;
			resultObject.invitation = false;
			resultObject.connection = false;

			var resultJson = JSON.stringify(resultObject);

      callback(true, resultJson);
    }else{
      console.log(results_check);

      if(results_check.length > 0){
        if(results_check[0].connection == 0){
          db_sql.update_connection_invite_user_id(results_check[0].invite_user_id, function(error, result_connect){
            if(error){
              resultObject.sender = true;
              resultObject.invitation = true;
        			resultObject.connection = false;

              var resultJson = JSON.stringify(resultObject);

              callback(true, resultJson);
            }else{
              resultObject.sender = true;
              resultObject.invitation = true;
              resultObject.connection = true;
              console.log(result_connect);

              var resultJson = JSON.stringify(resultObject);

              callback(null, resultJson);
            }
          });
        }else{
          resultObject.sender = true;
          resultObject.invitation = false;
          resultObject.connection = true;

          var resultJson = JSON.stringify(resultObject);

          callback(null, resultJson);
        }
      }else{

        invite_user(senderId, receiverPhoneNumber, roleName, function(error, results_invite){
          if(error){
            resultObject.sender = false;
            resultObject.invitation = false;
            resultObject.connection = false;

            var resultJson = JSON.stringify(resultObject);

            callback(null, resultJson);
          }else{
            resultObject.sender = false;
            resultObject.invitation = true;
            resultObject.connection = false;

            var resultJson = JSON.stringify(resultObject);

            callback(null, resultJson);
          }
        });


      }
    }
  });


};
