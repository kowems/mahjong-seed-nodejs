'use strict'

class base_module
{
    constructor(){
		this.crypto = require('../utils/crypto');
		// this.app = null;
		// this.db = null;
		// this.http = null;
	}

    start(app,http,db) {
		this.app = app;
		this.http = http;
		this.db = db;
        this.service();
	}

	/**服务内容 */
    service()
    {

    }

	/**执行SQL语句 */
	query(sql){
		console.log(sql);
		return this.db.query(sql);
	}

	/**res,错误编码，错误信息，发送数据 */
	send(res,errcode,errmsg,data){
		this.http.send(res,errcode,errmsg,data);
	}

	/**检测空及无效字符串*/
	checkNullValue(parms){	
		parms.forEach(function(element) {			
			if( element == null || element == "" )
			{
				return true;
			}
		}, this);
		return false;
	};

	/**检测token及权限等级获得代理信息*/
	checkTokenAndPrivilege(token,level)
	{
		if( this.checkNullValue([token]))
			return null;

		if( level == null )
			level = 0;

		var ret = this.getDealerBTyToken(token); 
		if(!ret || ret.privilege_level < level ){
			return null;
		}
		return ret;
	};

	/**根据token获得代理对象 */
	getDealerByToken(token){
		if(token == null){
			return null;
		}
		var sql = 'SELECT * FROM t_dealers WHERE token = "' + token + '"';
		var ret = this.query(sql);
		if(ret.err){
			console.log(ret.err);
			return null;
		}
		else{
			if(ret.rows.length == 0){
				return null;
			}
			return ret.rows[0];
		}
	};

	/**根据ID获得账号 */
	getDealerByAccount(account){
		if(account == null){
			return null;
		}
		var sql = 'SELECT * FROM t_dealers WHERE account = "' + account + '"';
		var ret = this.query(sql);
		if(ret.err){
			console.log(ret.err);
			return null;
		}
		else{
			if(ret.rows.length == 0){
				return null;
			}
			return ret.rows[0];
		}
	};

	/**KPI统计 */
	updateCumulative(account,type,value){

		if(this.checkNullValue([account,type,value]) )
		{
			return ;
		}

		var col = "";
		var gems = 0;
		var score = 0;
		var dealer = 0;
		switch (type) {
			case 0:
				col = "all_gems";
				gems = value;
				break;
			case 1:
				col = "all_score";
				score = value;
				break;
			case 2:
				col = "all_subs";
				dealer = value;
				break;
		}
		if( col == "")
			return ;

		var sql = 'UPDATE t_dealers SET {0} = {1} + {2} where account = "{3}"';
		sql = sql.format(col,col,value,account);
		var ret = this.query(sql);
		if(ret.err){
			console.log(ret.err);
			return false;
		}
		else{
			return ret.rows.affectedRows > 0;
		}  
	};



	/**交易订单*/
	addBillRecord(orderid,operator,target,num,time,note){
		var sql = 'INSERT INTO t_bills(orderid,operator,target,num,time,note) VALUES({0},"{1}","{2}",{3},{4},"{5}")';
		sql = sql.format(orderid,operator,target,num,time,note);
		
		var ret = this.query(sql);
		if(ret.err){
			if(ret.err.code == 'ER_DUP_ENTRY'){
				return false;
			}
			else{
				console.log(ret.err);
				return false;
			}
		}
		else{
			return ret.rows.affectedRows > 0;
		}
	};

	/**生成订单ID */
	getOrderID(){
		var d = new Date();
		var t = '' + Date.now();
		t = t.substring(5);
		return '' + (d.getYear() + 1900) + (d.getMonth()+1) + d.getDate() + t;
	};

	/**扣除代理房卡 */
	decDealerGems(account,gems){
		var sql = 'UPDATE t_dealers SET gems = gems - ' + gems + ' WHERE account = "' + account + '" AND gems >= ' + gems;
		var ret = this.query(sql);
		if(ret.err){
			console.log(ret.err);
			return false;
		}
		else{
			return ret.rows.affectedRows > 0;
		}
	};

	/**增加代理房卡 */
	addDealerGems(account,gems){
		var sql = 'UPDATE t_dealers SET gems = gems +' + gems + ' WHERE account = "' + account +'"';
		var ret = this.query(sql);
		if(ret.err){
			console.log(ret.err);
			return false;
		}
		else{
			this.updateCumulative(account,0,gems);
			return ret.rows.affectedRows > 0;
		}
	};


	/**扣除代理积分 */
	decDealerScore(account,score){
		var sql = 'UPDATE t_dealers SET score = score - ' + score + ' WHERE account = "' + account + '" AND score >= ' + score;
		var ret = this.query(sql);
		if(ret.err){
			console.log(ret.err);
			return false;
		}
		else{
			return ret.rows.affectedRows > 0;
		}
	};


	/**增加积分 */
	addDealerScore(account,score){
		var sql = 'UPDATE t_dealers SET score = score +' + score + ' WHERE account = "' + account +'"';
		var ret = this.query(sql);
		if(ret.err){
			console.log(ret.err);
			return false;
		}
		else{
			this.updateCumulative(account,1,score);
			return ret.rows.affectedRows > 0;
		}
	};


	/**获得积分比例 */
	getRates(){
		var sql = 'SELECT * FROM t_rates';
		var ret = this.query(sql);
		if(ret.err){
			console.log(ret.err);
			return null;
		}
		else{
			if(ret.rows.length == 0){
				return null;
			}
			return ret.rows[0];
		}
	};

}

module.exports = base_module;