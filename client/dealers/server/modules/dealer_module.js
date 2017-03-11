'use strict'
var base_module = require("./base_module");
// import * as base_module from "./base_module";
class user_module extends base_module
{
	constructor(){
		super();		
	}	

	service(){
		this.app.get('/search_dealer',function (req,res,next){
			this.search_dealer_account(req,res,next);
		}.bind(this) );

		this.app.get('/create_dealer',function(req,res,next){
			this.create_dealer(req,res);
		}.bind(this));

		this.app.get('/search_sub_dealers',function(req,res,next){
			this.search_sub_dealers(req,res);
		}.bind(this));

		this.app.get('/get_sub_dealer_by_account',function(req,res,next){
			this.get_sub_dealer_by_account(req,res);
		}.bind(this));

		this.app.get('/search_dealer_kpi',function(req,res,next){
			this.search_dealer_kpi(req,res);
		}.bind(this));

		this.app.get('/transfer_gems2dealer',function(req,res,next){
			this.transfer_gems2dealer(req,res);
		}.bind(this));

		this.app.get('/change_own_pwd',function(req,res,next){
			this.change_own_pwd(req,res);
		}.bind(this));


    };


	change_own_pwd(req,res)
	{
		var token = req.query.token;
		var account = req.query.account;
		var oldpwd = req.query.oldpwd;
		var newpwd = req.query.newpwd;

		if(this.checkNullValue([token,account,oldpwd,newpwd]) ){
			this.send(res,-1,"unknown error.");
			return;
		}

		var ret = this.getDealerByToken(token); 
		if(!ret){
			this.send(res,12580,"token check failed.");
			return;
		}

		if( account != ret.account )
		{
			this.send(res,2,"not own account.");
			return;
		}

		var kpi = this.changeDecalerPWD(account,oldpwd,newpwd);
		if( !kpi )
		{
			this.send(res,1,"Unknown error.");
			return ;
		}
		this.send(res,0,"ok");
	}


	transfer_gems2dealer(req,res)
	{
		var token = req.query.token;
		var target = req.query.account;
		var num = req.query.num;
		
		if(this.checkNullValue([token,target,num])){
			this.send(res,-1,"unknown error.");
			return;
		}
		
		num = parseInt(num);
		var dealer = this.getDealerByToken(token);
		if(!dealer){
			this.send(res,12580,"token check failed.");
			return;
		}

		var targetDealer = this.getDealerByAccount(target);
		if(!targetDealer){
			this.send(res,1,"can't find dealer.");
			return;
		}

		if(targetDealer.parent != dealer.account){
			this.send(res,2,"can only transfer to who under your management.");
			return;
		}

		if(dealer.gems < num){
			this.send(res,3,"lack of gems",{gems:dealer.gems});	
		}
		else{
			var ret = this.addBillRecord(this.getOrderID(),dealer.account,targetDealer.account,num,Date.now(),"");
			console.log("添加交易成功。")
			if(ret){
				if( this.decDealerGems(dealer.account,num) )
				{
					console.log("扣除成功。")
					if( this.addDealerGems(targetDealer.account,num) )
					{
						console.log("冲卡成功。")
						this.send(res,0,"ok",{gems:dealer.gems - num,targetgems:targetDealer.gems + num});
					}
				}else{
					this.send(res,4,"gems not enough");
				}			
			}
			else{
				this.send(res,4,"system is busy now, please try later.");
			}
		}
	}


	search_dealer_kpi(req,res)
	{
		var token = req.query.token;
		var account = req.query.account;
		var year = req.query.year;

		if(this.checkNullValue([token,account])){
			this.send(res,-1,"unknown error.");
			return;
		}

		var ret = this.getDealerByToken(token); 
		if(!ret){
			this.send(res,12580,"token check failed.");
			return;
		}

		if( !year)
			year = Date.getFullYear();

		var kpi = this.getDealerKpi(account,year);
		if( !kpi )
		{
			this.send(res,1,"Unknown error.");
			return ;
		}
		this.send(res,0,"ok",kpi);
	};

	get_sub_dealer_by_account(req,res){
		var token = req.query.token;
		var account = req.query.account;

		if(this.checkNullValue([token,account]))
		{
			this.send(res,-1,"unknown error.");
			return;
		}

		var ret = this.getDealerByToken(token); 
		if(!ret){
			this.send(res,12580,"token check failed.");
			return;
		}

		var result = this.getSubDealerByAccount(account,ret.account); 
		if(!result){
			this.send(res,1,"not in sub dealers.");
		}else{
			this.send(res,0,"ok",result);
		}		
	};


	search_sub_dealers(req,res){
		var token = req.query.token;
		var start = req.query.start;
		var rows = req.query.rows;

		if(this.checkNullValue([token,start,rows])){
			this.send(res,-1,"unknown error.");
			return;
		}

		var ret = this.getDealerByToken(token); 
		if(!ret){
			this.send(res,12580,"token check failed.");
			return;
		}

		var ret = this.getSubDealers(ret.account,start,rows); 
		if(ret){
			this.send(res,0,"ok.",ret);
		}else{
			this.send(res,1,"Unknow error.");
		}		
	};

	create_dealer(req,res){
		var token = req.query.token;
		var account = req.query.account;
		var password = req.query.password;
		var name = req.query.name;
		
		if(this.checkNullValue([token,account,password,name])){
			this.send(res,-1,"unknown error.");
			return;
		}

		var dealer = this.getDealerByToken(token);
		if(!dealer){
			this.send(res,12580,"token check failed.");
			return;
		}

		var ret = this.addDealer(account,password,name,dealer.account,0);
		if(ret){
			this.send(res,0,"ok");
		}
		else{
			this.send(res,1,"failed.");
		}
	};


	search_dealer_account(req,res,next){
		var token = req.query.token;
		var account = req.query.account;
		
		if(this.checkNullValue([token,account])){
			this.send(res,-1,"unknown error.");
			return;
		}

		var ret = this.getDealerByToken(token); 
		if(!ret){
			this.send(res,12580,"token check failed.");
			return;
		}
		
		var userdata = this.getDealerByAccount(account);
		if(userdata){
			this.send(res,0,"ok",userdata);
		}
		else{
			this.send(res,1,"can't find dealer.");		
		}
	};
//====================================================================================
	/**新增代理 */
	addDealer(account,password,name,parent,privi){
		if(this.checkNullValue([account,password,name,parent,privi])){
			return false;
		}
		
		var sql = 'INSERT INTO t_dealers(account,password,name,parent,create_time,privilege_level) VALUES("{0}",PASSWORD("{1}"),"{2}","{3}",{4},{5})';
		sql = sql.format(account,password,name,parent,Date.now(),privi);

		var ret = this.query(sql);
		if(ret.err){			
			return false;
		}
		else{
			this.updateCumulative(parent,2,1);
			return true;
		}
	};

	/**查询下级代理 */
	getSubDealers(parent,start,rows){
		if( this.checkNullValue([parent,start,rows]) )
			return null;
		
		var sql = 'SELECT account,name,gems,score,all_gems,all_score,all_subs FROM t_dealers where parent="{0}" limit {1},{2}';
		sql = sql.format(parent,start,rows);

		var ret = this.query(sql);
		if(ret.err){
			console.log(ret.err);
			return null;
		}
		else{
			return ret.rows;
		}
	};

	/**查询下级代理 根据ID */
	getSubDealerByAccount(account,parent){		
		if( this.checkNullValue([account,parent]) )
			return null;

		var sql = 'SELECT account,name,gems,score,all_gems,all_score,all_subs FROM t_dealers WHERE account = "{0}" and parent ="{1}"';
		sql = sql.format(account,parent);
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

	/**查询某代理的KPI */
	getDealerKpi(account,year)
	{
		if(this.checkNullValue([account,year])){
			return null;
		}    
		
		var sql = 'SELECT * FROM t_dealers_kpi WHERE account = "{0}" and year = {1} ' ;
		sql = sql.format(account,year);

		var ret = this.query(sql);
		if(ret.err){
			console.log(ret.err);
			return null;
		}
		else{
			return ret.rows;
		}
	};	

	/**修改密码 */
	changeDecalerPWD(account,oldPwd,newPwd){
		if(account == null || oldPwd == null || newPwd == null){
			return false;
		}
		
		var sql = 'UPDATE t_dealers SET password = PASSWORD("{0}") where account = "{1}" AND password = PASSWORD("{2}")';
		sql = sql.format(newPwd,account,oldPwd);
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
			return true;
		}
	};

}

module.exports = user_module;