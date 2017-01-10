var util = require('util');
var moment = require('moment');

var db = require('./db_action');

var _this = this;

const max_lim = 1000;

/*
 * error table query
 */

 exports.insert_error = function(log, callback) {
     console.time('insert_error');
     var sql = util.format('INSERT INTO error (' +
         'user_id, log_txt) ' +
         'VALUE (null, \'%s\')',
         log);
     db.getResult(sql, '', function (err, results) {
         console.timeEnd('insert_error');
         callback(err, results);
     });
 };

exports.select_error = function(callback) {
   var sql = util.format("SELECT * FROM error");
   db.getResult(sql, '', function (err, results_error) {
     callback(err, results_error);
   });
};

exports.insert_user_error = function(userId, log, callback) {
    console.time('insert_error');
    var sql = util.format('INSERT INTO error (' +
        'user_id, log_txt) ' +
        'VALUE (\'%s\', \'%s\')',
        userId, log);
    db.getResult(sql, '', function (err, results) {
        console.timeEnd('insert_error');
        callback(err, results);
    });
};

exports.select_user_error = function(userId, callback) {
   var sql = util.format("SELECT * FROM error WHERE (" +
     "user_id = %d)",
      userId);
   db.getResult(sql, '', function (err, select_user_error) {
       callback(err, select_user_error);
   });
};


/*
 * user table query
 */
exports.insert_user = function(phoneNumber, password, callback) {
   console.time('insert_user');
   var sql = util.format('INSERT INTO user (' +
       'phone_number_sn, password_sn) ' +
       'VALUE (\'%s\', \'%s\')',
       phoneNumber, password);
   db.getResult(sql, '', function (err, results) {
       console.timeEnd('insert_user');
       callback(err, results);
   });
};


exports.select_user_phone_number = function(phoneNumber, callback){
  var sql = util.format('SELECT * FROM user WHERE (' +
      'phone_number_sn)' +
      '= (\'%s\')',
      phoneNumber);
  db.getResult(sql, '', function (err, results_phone) {
    callback(err, results_phone);
  });
};

exports.select_user_password = function(phoneNumber, callback){
  var sql = util.format('SELECT password_sn FROM user WHERE (' +
      'phone_number_sn' +
      '= \'%s\')',
      phoneNumber);
  db.getResult(sql, '', function (err, results_password) {
    callback(err, results_password);
  });
};


/*
 * user_setting table query
 */
 exports.insert_user_setting = function(userId, messageAlert, reserveEnable, reserveAlert, weekNumber, reserveNumber, callback) {
   console.time('insert_user_setting');
   var sql = util.format('INSERT INTO user_setting (' +
       'user_id, message_alert, reserve_enable, reserve_alert, week_number, reserve_number) ' +
       'VALUE (\'%s\', \'%s\', \'%s\', \'%s\', \'%s\', \'%s\')',
       userId, messageAlert, reserveEnable, reserveAlert, weekNumber, reserveNumber);
   db.getResult(sql, '', function (err, results) {
       console.timeEnd('insert_user_setting');
       callback(err, results);
   });
 };

 exports.select_user_setting = function(userId, callback){
   var sql = util.format('SELECT * FROM user_setting WHERE ( ' +
    'user_id = \'%s\')',
    userId);
    db.getResult(sql, '', function (err, results) {
        callback(err, results);
    });
 };

 exports.update_user_setting = function (userId, messageAlert, reserveEnable, reserveAlert, weekNumber, reserveNumber, callback) {
   console.time('update_user_setting');
   var sql = util.format("UPDATE user_setting SET " +
    "message_alert = %s, reserve_enable = %s, reserve_alert = %s, week_number = \'%s\', reserve_number = \'%s\', update_dtm = now() " +
    "WHERE user_id = \'%s\'",
    messageAlert, reserveEnable, reserveAlert, weekNumber, reserveNumber,
    userId);
   db.getResult(sql, '', function (err, results) {
      console.time('update_user_setting');
      callback(err, results);
   });
 };

 exports.delete_user_setting = function (userId, callback) {
     var sql = util.format("DELETE FROM user_setting WHERE user_id = \'%s\'", userId);
     db.getResult(sql, '', function (err, delete_Obj) {
         if(!err) {
             callback(err, delete_Obj);
         }
     });
 };


/*
 * user_information table query
 */
exports.insert_user_information = function(userId, nickname, sex, birthday, profile, callback) {
  console.time('insert_user_information');
  var sql = util.format('INSERT INTO user_information (' +
      'user_id, nickname_sn, sex_sn, birthday_dt, profile_ln) ' +
      'VALUE (%s, \'%s\', \'%s\', \'%s\', \'%s\')',
      userId, nickname, sex, birthday, profile);
  db.getResult(sql, '', function (err, results) {
      console.timeEnd('insert_user_information');
      callback(err, results);
  });
};

exports.select_user_information = function(userId, callback){
  var sql = util.format('SELECT * FROM user_information WHERE ( ' +
   'user_id = %s)',
   userId);
   db.getResult(sql, '', function (err, results) {
       callback(err, results);
   });
};

exports.update_user_information = function(userId, nickname, sex, birthday, profile, callback) {
  console.time('update_user_information');
  var sql = util.format("UPDATE user_information SET " +
   "nickname_sn = \'%s\', sex_sn = \'%s\', birthday_dt = \'%s\', profile_ln = \'%s\', update_dtm = now() " +
   "WHERE user_id = %s",
   nickname, sex, birthday, profile,
   userId);
  db.getResult(sql, '', function (err, results) {
     console.time('update_user_information');
     callback(err, results);
  });
};

exports.delete_user_information = function (userId, callback) {
    var sql = util.format("DELETE FROM user_information WHERE user_id = \'%s\'", userId);
    db.getResult(sql, '', function (err, delete_Obj) {
        if(!err) {
            callback(err, delete_Obj);
        }
    });
};

/*
 * message, send_message table query
 */

 exports.insert_message = function(message, callback) {
   console.time('insert_message');
   var sql = util.format('INSERT INTO message (' +
       'content_txt) ' +
       'VALUE (\'%s\')',
       message);
   db.getResult(sql, '', function (err, results) {
       console.timeEnd('insert_message');
       callback(err, results);
   });
 };

 exports.insert_send_message = function(messageId, senderId, receiverId, callback) {
   console.time('insert_send_message');
   var sql = util.format('INSERT INTO send_message (' +
       'message_id, sender_id, receiver_id) ' +
       'VALUE (\'%s\', \'%s\', \'%s\')',
       messageId, senderId, receiverId);
   db.getResult(sql, '', function (err, results) {
       console.timeEnd('insert_send_message');
       callback(err, results);
   });
 };

exports.select_user_send_message = function(senderId, receiverId, callback){
  var sql = util.format('SELECT send_dtm, content_txt, unread_check FROM send_message INNER JOIN message ' +
   'ON send_message.message_id = message.message_id ' +
   'WHERE sender_id = \'%s\' AND receiver_id = \'%s\'',
   senderId, receiverId);
   db.getResult(sql, '', function (err, results) {
       callback(err, results);
   });
};


exports.select_user_all_data = function(userId, callback){
  var sql = util.format("select u_2.user_id, nickname_sn, sex_sn, birthday_dt, profile_ln, role_name_sn, message_alert, reserve_enable, reserve_alert, week_number, reserve_number from user_setting as us join (select ui.user_id, nickname_sn, sex_sn, birthday_dt, profile_ln, role_name_sn from user_information as ui join (select user_id, role_name_sn from choose_role as cu join user_role as ur on cu.user_role_id = ur.user_role_id where user_id = %s) as u_1 on ui.user_id = u_1.user_id) as u_2 on us.user_id = u_2.user_id",
   userId);
   db.getResult(sql, '', function (err, results) {
       callback(err, results);
   });
};

/*
 * user_role, choose_role table query
 */

exports.select_role_id = function(roleName, callback){
  var sql = util.format("SELECT * FROM user_role " +
    "WHERE role_name_sn = \'%s\'",
    roleName);
    db.getResult(sql, '', function (err, results) {
        callback(err, results);
    });
};

exports.select_user_choose_role = function(userId, roleId, callback){
  var sql = util.format("SELECT * FROM choose_role " +
    "WHERE user_id = %s AND user_role_id = %s",
    userId, roleId);
    db.getResult(sql, '', function (err, results) {
        callback(err, results);
    });
};

exports.insert_user_choose_role = function(userId, roleId, callback){
  var sql = util.format("INSERT INTO choose_role (user_id, user_role_id) " +
    "VALUE (%s, %s)",
   userId, roleId);
   db.getResult(sql, '', function (err, results) {
       callback(err, results);
   });
};

exports.insert_user_invite_user = function(chooseRoleId, receiverPhoneNumber, callback){
  var sql = util.format("INSERT INTO invite_user (choose_role_id, receiver_phone_number_sn)" +
    "VALUE (%s, \'%s\')",
    chooseRoleId, receiverPhoneNumber);
    db.getResult(sql, '', function (err, results) {
        callback(err, results);
    });
};


//--------------------------------------------------------------------



exports.update_ts_mdcn_mdl = function (mdcn, mdl, ri, callback) {
    var sql = util.format("update ts set mdcn = \'%s\', mdl = \'%s\' where ri = \'%s\'", mdcn, mdl, ri);
    db.getResult(sql, '', function (err, results) {
        callback(err, results);
    });
};

exports.update_cb_poa_csi = function (poa, csi, ri, callback) {
    console.time('update_cb_poa_csi');
    var sql = util.format('update cb set poa = \'%s\', csi = \'%s\' where ri=\'%s\'', poa, csi, ri);
    db.getResult(sql, '', function (err, results) {
        console.timeEnd('update_cb_poa_csi');
        callback(err, results);
    });
};


exports.delete_ri_lookup = function (ri, callback) {
    var sql = util.format("delete from lookup where ri = \'%s\'", ri);
    db.getResult(sql, '', function (err, delete_Obj) {
        if(!err) {
            callback(err, delete_Obj);
        }
    });
};

exports.delete_lookup = function (ri, pi_list, pi_index, found_Obj, found_Cnt, callback) {
    var cur_pi = [];
    cur_pi.push(pi_list[pi_index]);

    if(pi_index == 0) {
        console.time('delete_lookup');
    }

    var sql = util.format("delete a.* from (select ri from lookup where pi in ("+JSON.stringify(cur_pi).replace('[','').replace(']','') + ")) b left join lookup as a on b.ri = a.ri");
    db.getResult(sql, '', function (err, search_Obj) {
        if(!err) {
            found_Cnt += search_Obj.affectedRows;
            if(++pi_index >= pi_list.length) {
                sql = util.format("delete from lookup where ri = \'%s\'", pi_list[0]);
                db.getResult(sql, '', function (err, search_Obj) {
                    if(!err) {
                        console.timeEnd('delete_lookup');
                        found_Cnt += search_Obj.affectedRows;
                        console.log('deleted ' + found_Cnt + ' resource(s).');
                    }
                    callback(err, found_Obj);
                });
            }
            else {
                _this.delete_lookup(ri, pi_list, pi_index, found_Obj, found_Cnt, function (err, found_Obj) {
                    callback(err, found_Obj);
                });
            }
        }
    });
};
