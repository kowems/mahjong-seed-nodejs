'use strict'
var base_module = require("./base_module");
// import * as base_module from "./base_module";
class user_module extends base_module
{
	constructor(){
		super();		
	}	

	service(){
		this.app.get('/login',function (req,res,next){
				this.user_login(req,res,next);
			}.bind(this) );
    };

	user_login(req,res,next){
		var account = req.query.account;
		var password = req.query.password;

		if( this.checkNullValue([account,password]) ){
			this.send(res,1,"Unknow error.");
		}

		var data = this.checkAccount(account,password);
		if(!data){
			this.send(res,2,"login failed.");
			return;
		}

		var token = this.crypto.md5(account + password + Date.now());
		var ret = this.updateToken(account,token);
		if(!ret){
			this.send(res,3,"failed to get token.");
			return;
		}

		this.send(res,0,"ok",{
			privilege_level:data.privilege_level,
			all_gems:data.all_gems,
			all_score:data.all_score,
			all_subs:data.all_subs,
			score:data.score,
			gems:data.gems,
			name:data.name,
			account:account,
			token:token
		});	
	};

//=====================================================================

	/**查询代理 */
	checkAccount(account,password){
		if(account == null || password == null){
			return null;
		}		
		var sql = ' SELECT * FROM t_dealers WHERE account = "' + account + '" AND password = PASSWORD("' + password + '")';
		var ret = this.query(sql);
		if(ret.err){
			return null;
		}
		else{
			if(ret.rows.length == 0){
				return null;
			}
			return ret.rows[0];
		}
	};

	/**更新token */
	updateToken(account,token){
		if(account == null || token == null){
			return false;
		}
		var sql = 'UPDATE t_dealers SET token = "' + token +'" WHERE account = "' + account + '"';
		var ret = this.query(sql);
		if(ret.err){
			return false;
		}
		else{
			return ret.rows.affectedRows > 0;
		}
	};
}

module.exports = user_module;