
var db_sql = require('./sql_action');


exports.invite_user = function(userId, receiverPhoneNumber, roleName, callback){
  //console.log("invite_user");
  //console.log("phoneNumber : " + phoneNumber + ", password : " + password);
  db_sql.select_role_id(roleName, function(error, results_role_id){
		if(error){
			console.log("error : " + error);
			callback(true, results_role_id);
		}else{
      var roleId = results_role_id[0].user_role_id;
      console.log("roleId : " + roleId);

      db_sql.select_user_choose_role(userId, roleId, function(error, results_role){
    		if(error){
    			console.log("error : " + error);
    			callback(true, results_role);
    		}else{
          var chooseRoleId = results_role[0].choose_role_id;
          console.log(chooseRoleId);
          if(results_role[0].choose_role_id == null){
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
};
