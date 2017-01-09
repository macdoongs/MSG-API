var util = require('util');
var moment = require('moment');

var db = require('./db_action');

var _this = this;

const max_lim = 1000;

/*
 * error table query
 */
exports.select_error = function(callback) {
   var sql = util.format("SELECT * FROM error");
   db.getResult(sql, '', function (err, results_error) {
     callback(err, results_error);
   });
};


exports.select_user_error = function(userId, callback) {
   var sql = util.format("SELECT * FROM error WHERE user_id = %d", userId);
   db.getResult(sql, '', function (err, select_user_error) {
       callback(err, select_user_error);
   });
};

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
  db.getResult(sql, '', function (err, results_error) {
    callback(err, results_error);
  });
};

/*
 * user_information table query
 */
exports.insert_user_information = function(userId, nickname, sex, birthday, profile, callback) {
    console.time('insert_user_information');
    var sql = util.format('INSERT INTO user_information (' +
        'user_id, nickname_sn, sex_sn, birthday_dt, profile_ln) ' +
        'VALUE (\'%s\', \'%s\', \'%s\', \'%s\', \'%s\' )',
        userId, nickname, sex, birthday, profile);
    db.getResult(sql, '', function (err, results) {
        console.timeEnd('insert_user');
        callback(err, results);
    });
 };

/*
 * user table query
 */


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
