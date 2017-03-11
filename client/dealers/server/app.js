var crypto = require('./utils/crypto');
var express = require('express');
var Fiber = require('fibers');

var DBClass = require('./utils/db_utils');
var db = new DBClass();

var HTTPClass = require("./utils/http_utils");
var http = new HTTPClass();

var app = express();

var configs = require(process.argv[2]);

db.init(configs.mysql());
app.listen(configs.port);

// function send(res,ret){
// 	var str = JSON.stringify(ret);
// 	res.send(str)
// }

// /**生成订单ID */
// function getOrderID(){
// 	var d = new Date();
// 	var t = '' + Date.now();
// 	t = t.substring(5);
// 	return '' + (d.getYear() + 1900) + (d.getMonth()+1) + d.getDate() + t;
// }

//设置跨域访问
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
	Fiber(function(){
		next();
	}).run();
});


var UserModule = require("./modules/user_module");
var user = new UserModule();
user.start(app,http,db);


var DealerModule = require("./modules/dealer_module");
var dealer = new DealerModule();
dealer.start(app,http,db);


var PlayerModule = require("./modules/player_module");
var player = new PlayerModule();
player.initUserService(configs.users());
player.start(app,http,db);


var NoticeModule = require("./modules/notice_module");
var notice = new NoticeModule();
notice.start(app,http,db);


var ShopModule = require("./modules/shop_module");
var shop = new ShopModule();
shop.start(app,http,db);

// /**登录 */
// app.get('/login',function(req,res){
// 	var account = req.query.account;
// 	var password = req.query.password;
// 	var data = db.check_account(account,password);
// 	if(!data){
// 		http.send(res,{errcode:1,errmsg:"login failed."});
// 		return;
// 	}
// 	var token = crypto.md5(account + password + Date.now());
// 	var ret = db.update_token(account,token);
// 	if(!ret){
// 		http.send(res,2,"failed to get token.");
// 		return;
// 	}

// 	http.send(res,0,"ok",{
// 		privilege_level:data.privilege_level,
// 		all_gems:data.all_gems,
// 		all_score:data.all_score,
// 		all_subs:data.all_subs,
// 		score:data.score,
// 		gems:data.gems,
// 		name:data.name,
// 		account:account,
// 		token:token
// 	});	
// });

/**退出登录 */

/**========================================================================================================================================================== */
/**通用查询 */
// app.get('/search_dealer',function(req,res){
// 	var token = req.query.token;
// 	var account = req.query.account;
// 	if(token == null || token == "" || account == null || account == ""){
// 		http.send(res,-1,"unknown error.");
// 		return;
// 	}

// 	var ret = db.get_dealer_by_token(token); 
// 	if(!ret){
// 		http.send(res,12580,"token check failed.");
// 		return;
// 	}
	
// 	var userdata = db.get_dealer_by_account(account);
// 	if(userdata){
// 		http.send(res,0,"ok",userdata);
// 	}
// 	else{
// 		http.send(res,1,"can't find dealer.");		
// 	}
// });
// /**查询玩家 */
// app.get('/search_user',function(req,res){
// 	var token = req.query.token;
// 	var userid = req.query.userid;
// 	if(token == null || token == "" || userid == null || userid == ""){
// 		http.send(res,-1,"unknown error.");
// 		return;
// 	}


// 	var ret = db.get_dealer_by_token(token); 
// 	if(!ret){
// 		http.send(res,12580,"token check failed.");
// 		return;
// 	}

// 	var userdata = db.get_user_game_info(userid);
// 	if(userdata){
// 	http.send(res,0,"ok",{
// 			userid:userdata.userid,
// 			gems:userdata.gems,
// 			name:userdata.name,
// 		});
// 	}
// 	else{
// 		http.send(res,2,"can't find user.");		
// 	}
// });


// /**为玩家充值房卡 */
// app.get('/transfer_gems2user',function(req,res){
// 	var token = req.query.token;
// 	var userid = req.query.userid;
// 	var num = req.query.num;
	
// 	if(token == null || token == "" || userid == null || userid == "" || num == null || num == ""){
// 		http.send(res,-1,"unknown error.");
// 		return;
// 	}
	
// 	num = parseInt(num);
// 	var dealer = db.get_dealer_by_token(token);
// 	if(!dealer){
// 		http.send(res,12580,"token check failed.");
// 		return;
// 	}

// 	var userdata = db.get_user_game_info(userid);
// 	if(!userdata){
// 		http.send(res,2,"can't find user.");
// 		return;
// 	}

// 	if(dealer.gems < num){
// 		http.send(res,4,"lack of gems",{gems:dealer.gems});	
// 	}
// 	else{
// 		var ret = db.add_bill_record(getOrderID(),dealer.account,userdata.userid,num,Date.now(),"");
// 		if(ret){
// 			db.dec_dealer_gems(dealer.account,num);
// 			db.add_user_gems(userdata.userid,num);

// 			http.send(res,0,"ok",{gems:dealer.gems - num,targetgems:userdata.gems + num});
			
// 			//积分返还
// 			var rates = db.get_rates();

// 			db.add_dealer_score(dealer.account,num*rates.rate1);

// 			var parent = db.get_dealer_by_account(dealer.parent);
// 			if(parent){
// 				db.add_dealer_score(parent.account,num*rates.rate2);
// 				//向上上一级代理返积分
// 				if(parent.parent){
// 					db.add_dealer_score(parent.parent,num*rates.rate3);
// 				}
// 			}
// 		}
// 		else{
// 			http.send(res,5,"system is busy now, please try later.");
// 		}
// 	}
// });

/**========================================================================================================================================================== */

// /**添加代理 */
// app.get('/create_dealer',function(req,res){
// 	var token = req.query.token;
// 	var account = req.query.account;
// 	var password = req.query.password;
// 	var name = req.query.name;
	
// 	if(token == null || token == "" || account == null || account == "" || password == null || password == "" || name == null || name == ""){
// 		http.send(res,-1,"unknown error.");
// 		return;
// 	}

// 	var dealer = db.get_dealer_by_token(token);
// 	if(!dealer){
// 		http.send(res,12580,"token check failed.");
// 		return;
// 	}

// 	var ret = db.create_dealer(account,password,name,dealer.account,0);
// 	if(ret){
// 		http.send(res,0,"ok");
// 	}
// 	else{
// 		http.send(res,1,"failed.");
// 	}
// });



// /**查询下级代理 */
// app.get('/search_sub_dealers',function(req,res){
// 	var token = req.query.token;
// 	var start = req.query.start;
// 	var rows = req.query.rows;
// 	if(token == null || token == ""){
// 		http.send(res,-1,"unknown error.");
// 		return;
// 	}

// 	var ret = db.get_dealer_by_token(token); 
// 	if(!ret){
// 		http.send(res,12580,"token check failed.");
// 		return;
// 	}

// 	var ret = db.search_sub_dealers(ret.account,start,rows); 
// 	if(!ret){
// 		http.send(res,1,"Unknow error.");
// 		return;
// 	}	 
// 	http.send(res,0,"ok.",ret);
// });


// /**查询下级代理By account */
// app.get('/get_sub_dealer_by_account',function(req,res){
// 	var token = req.query.token;
// 	var account = req.query.account;
// 	if(token == null || token == "" || account == null || account == "")
// 	{
// 		http.send(res,-1,"unknown error.");
// 		return;
// 	}

// 	var ret = db.get_dealer_by_token(token); 
// 	if(!ret){
// 		http.send(res,12580,"token check failed.");
// 		return;
// 	}

// 	var ret = db.get_sub_dealer_by_account(account,ret.account); 
// 	if(!ret){
// 		http.send(res,1,"not in sub dealers.");
// 		return;
// 	}	 
// 	http.send(res,0,"ok",ret);
// });

// /**查询KPI */
// app.get('/search_dealer_kpi',function(req,res)
// {
// 	var token = req.query.token;
// 	var account = req.query.account;
// 	var year = req.query.year;

// 	if(token == null || token == "" || account == null || account == ""){
// 		http.send(res,-1,"unknown error.");
// 		return;
// 	}

// 	var ret = db.get_dealer_by_token(token); 
// 	if(!ret){
// 		http.send(res,12580,"token check failed.");
// 		return;
// 	}
// 	if( !year)
// 		year = Date.getFullYear();

// 	var kpi = db.get_dealer_kpi(account,year);
// 	if( !kpi )
// 	{
// 		http.send(res,1,"Unknown error.");
// 		return ;
// 	}
// 	http.send(res,0,"ok",kpi);
// });

// /**为代理充值房卡 */
// app.get('/transfer_gems2dealer',function(req,res){
// 	var token = req.query.token;
// 	var target = req.query.account;
// 	var num = req.query.num;
	
// 	if(token == null || token == "" || target == null || target == "" || num == null || num == ""){
// 		http.send(res,-1,"unknown error.");
// 		return;
// 	}
	
// 	num = parseInt(num);
// 	var dealer = db.get_dealer_by_token(token);
// 	if(!dealer){
// 		http.send(res,12580,"token check failed.");
// 		return;
// 	}

// 	var targetDealer = db.get_dealer_by_account(target);
// 	if(!targetDealer){
// 		http.send(res,1,"can't find dealer.");
// 		return;
// 	}

// 	if(targetDealer.parent != dealer.account){
// 		http.send(res,2,"can only transfer to who under your management.");
// 		return;
// 	}

// 	if(dealer.gems < num){
// 		http.send(res,3,"lack of gems",{gems:dealer.gems});	
// 	}
// 	else{
// 		var ret = db.add_bill_record(getOrderID(),dealer.account,targetDealer.account,num,Date.now(),"");
// 		console.log("添加交易成功。")
// 		if(ret){
// 			if( db.dec_dealer_gems(dealer.account,num) )
// 			{
// 				console.log("扣除成功。")
// 				if( db.add_dealer_gems(targetDealer.account,num) )
// 				{
// 					console.log("冲卡成功。")
// 					http.send(res,0,"ok",{gems:dealer.gems - num,targetgems:targetDealer.gems + num});
// 				}
// 			}else{
// 				http.send(res,4,"gems not enough");
// 			}			
// 		}
// 		else{
// 			http.send(res,4,"system is busy now, please try later.");
// 		}
// 	}
// });


// /**修改密码 */
// app.get('/change_own_pwd',function(req,res){
// 	var token = req.query.token;
// 	var account = req.query.account;
// 	var oldpwd = req.query.oldpwd;
// 	var newpwd = req.query.newpwd;

// 	if(token == null || token == "" || account == null || account == ""){
// 		http.send(res,-1,"unknown error.");
// 		return;
// 	}

// 	var ret = db.get_dealer_by_token(token); 
// 	if(!ret){
// 		http.send(res,12580,"token check failed.");
// 		return;
// 	}
// 	if( account != ret.account )
// 	{
// 		http.send(res,2,"not own account.");
// 		return;
// 	}
// 	var kpi = db.change_decaler_pwd(account,oldpwd,newpwd);
// 	if( !kpi )
// 	{
// 		http.send(res,1,"Unknown error.");
// 		return ;
// 	}
// 	http.send(res,0,"ok");
// });


/**设置抽成比例 权限1000 以上可以修改  */
app.get('/change_rates',function(req,res){
	var token = req.query.token;
	var rate1 = req.query.rate1;
	var rate2 = req.query.rate2;
	var rate3 = req.query.rate3;

	if(token == null || token == "" || rate1 == null || rate1 == ""
		|| rate2 == null || rate2 == "" || rate3 == null || rate3 == "" ||
		rate1 < 0 || rate2 < 0  || rate3 < 0 ){
		http.send(res,-1,"unknown error.");
		return;
	}

	var ret = db.get_dealer_by_token(token); 
	if(!ret){
		http.send(res,12580,"token check failed.");
		return;
	}
	if( ret.privilege_level < 1000 )
	{
		http.send(res,2,"no privilege.");
		return;
	}
	var state = db.update_rates(rate1,rate2,rate3);
	if( !state )
	{
		http.send(res,1,"Unknown error.");
		return ;
	}
	http.send(res,0,"ok");
});

/**新闻公告======================================================================================================= */
/**获取新闻公告*/
// app.get('/get_notice',function(req,res){
// 	var token = req.query.token;

// 	if(token == null || token == "" ){
// 		http.send(res,-1,"unknown error.");
// 		return;
// 	}
// 	var ret = db.get_dealer_by_token(token); 
// 	if(!ret){
// 		http.send(res,12580,"token check failed.");
// 		return;
// 	}
// 	var notice = db.get_notice();
// 	if( !notice )
// 	{
// 		http.send(res,1,"Unknown error.");
// 		return ;
// 	}
// 	http.send(res,0,"ok",notice);
// });
// /**获取所有公告 */
// app.get('/get_notice_all',function(req,res){
// 	var token = req.query.token;

// 	if(token == null || token == "" ){
// 		http.send(res,-1,"unknown error.");
// 		return;
// 	}
// 	var ret = db.get_dealer_by_token(token); 
// 	if(!ret){
// 		http.send(res,12580,"token check failed.");
// 		return;
// 	}
// 	var notice = db.get_notice_all();
// 	if( !notice )
// 	{
// 		http.send(res,1,"Unknown error.");
// 		return ;
// 	}
// 	http.send(res,0,"ok",notice);
// });


// /**更新有公告 */
// app.get('/update_notice',function(req,res){
// 	var token = req.query.token;
// 	var id = req.query.id;
// 	var title = req.query.title;
// 	var content = req.query.content;
// 	var level = req.query.level;
// 	var actTime = req.query.actTime;
// 	var endTime = req.query.endTime;

// 	if(token == null || token == "" || id == null || id == "" ){
// 		http.send(res,-1,"unknown error.");
// 		return;
// 	}
// 	var ret = db.get_dealer_by_token(token); 
// 	if(!ret || ret.privilege_level < 1000 ){
// 		http.send(res,12580,"token check failed.");
// 		return;
// 	}

// 	var notice = db.update_notice(id,title,content,level,actTime,endTime);
// 	if( !notice )
// 	{
// 		http.send(res,1,"Unknown error.");
// 		return ;
// 	}
// 	http.send(res,0,"ok");
// });


// /**新增公告 */
// app.get('/add_notice',function(req,res){
// 	var token = req.query.token;
// 	var id = req.query.id;
// 	var title = req.query.title;
// 	var content = req.query.content;
// 	var level = req.query.level;
// 	var actTime = req.query.actTime;
// 	var endTime = req.query.endTime;

// 	if(token == null || token == "" || id == null || id == "" ){
// 		http.send(res,-1,"unknown error.");
// 		return;
// 	}
// 	var ret = db.get_dealer_by_token(token); 
// 	if(!ret || ret.privilege_level < 1000 ){
// 		http.send(res,12580,"token check failed.");
// 		return;
// 	}

// 	var notice = db.insert_notice(id,title,content,level,actTime,endTime);
// 	if( !notice )
// 	{
// 		http.send(res,1,"Unknown error.");
// 		return ;
// 	}
// 	http.send(res,0,"ok");
// });


// /**删除公告 */
// app.get('/delete_notice',function(req,res){
// 	var token = req.query.token;
// 	var id = req.query.id;

// 	if( check_null_value(req.query,["token","id"]) ){
// 		http.send(res,-1,"unknown error.");
// 		return;
// 	}

// 	var ret = check_token_privilege(token,0);
// 	if(!ret)
// 	{
// 		http.send(res,12580,"token check failed.");
// 		return;
// 	}

// 	var notice = db.delete_notice(id);
// 	if( !notice )
// 	{
// 		http.send(res,1,"Unknown error.");
// 		return ;
// 	}
// 	http.send(res,0,"ok");
// });

/*====================================================================================================== */
// /**获取商品*/
// app.get('/get_goods',function(req,res){
// 	var token = req.query.token;

// 	if(token == null || token == "" ){
// 		http.send(res,-1,"unknown error.");
// 		return;
// 	}
// 	var ret = check_token_privilege(token,0); 
// 	if(!ret){
// 		http.send(res,12580,"token check failed.");
// 		return;
// 	}
// 	var goods = db.get_goods();
// 	if( !goods )
// 	{
// 		http.send(res,1,"Unknown error.");
// 		return ;
// 	}
// 	http.send(res,0,"ok",goods);
// });


// /**购买商品*/
// app.get('/buy_goods',function(req,res){
// 	var token = req.query.token;
// 	var id = req.query.id;

// 	if(token == null || token == "" ){
// 		http.send(res,-1,"unknown error.");
// 		return;
// 	}
// 	var ret = check_token_privilege(token,0); 
// 	if(!ret){
// 		http.send(res,12580,"token check failed.");
// 		return;
// 	}
// 	var goods = db.get_goods_id(id);
// 	if( !goods )
// 	{
// 		http.send(res,1,"Unknown error.");
// 		return ;
// 	}
	
// 	//获得价格 货币 0，RMB  1:积分 2：房卡 
// 	if( goods.price_type == 1 )
// 	{
// 		if( goods.price > ret.score )
// 		{
// 			http.send(res,2,"lack of score");
// 			return ;
// 		}
// 	}else if( goods.price_type == 2)
// 	{
// 		if( goods.price > ret.gems )
// 		{
// 			http.send(res,2,"lack of gems");
// 			return ;
// 		}
// 	}else
// 	{
// 		http.send(res,1,"Unknown error.");
// 		return ;
// 	}

// 	//购买逻辑
// 	if( db.buy_goods_log(ret.account,goods.goods_type,goods.goods_num,goods.goods_price,goods.price_type,Date.now()) )
// 	{
// 		var payed = false;
// 		if( goods.price_type == 1 )
// 		{
// 			//扣除积分
// 			payed = db.dec_dealer_score(ret.account,goods.goods_price);
// 		}else if( goods.price_type == 2)
// 		{
// 			//扣除房卡
// 			payed = db.dec_dealer_gems(ret.account,goods.goods_price);
// 		}

// 		if(payed)
// 		{
// 			payed = false;
// 			//增加购买物品
// 			if( goods.goods_type == 1 )
// 			{
// 				//增加房卡
// 				payed = db.add_dealer_gems(ret.account,goods.goods_num);
// 			}else if( goods.goods_type == 2)
// 			{
// 				//增加积分
// 				payed = db.add_dealer_score(ret.account,goods.goods_num);
// 			}

// 			if( payed )
// 			{
// 				http.send(res,0,"OK",{goods_type:goods.goods_type,goods_num:goods.goods_num});
// 			}else{
// 				http.send(res,4,"buy failed");
// 			}

// 		}else{
// 			//扣款失败
// 			http.send(res,3,"pay failed.");
// 			return ;
// 		}
// 	}else{
// 		http.send(res,5,"system error");
// 	}
	
// });


// /**获取购买商品记录*/
// app.get('/get_buy_goods_log',function(req,res){
// 	var token = req.query.token;
// 	var start = req.query.start;
// 	var rows = req.query.rows;

// 	if(token == null || token == "" ){
// 		http.send(res,-1,"unknown error.");
// 		return;
// 	}
// 	var ret = check_token_privilege(token,0); 
// 	if(!ret){
// 		http.send(res,12580,"token check failed.");
// 		return;
// 	}
// 	var goods = db.get_buy_goods_log(ret.account,start,rows);
// 	if( !goods )
// 	{
// 		http.send(res,1,"Unknown error.");
// 		return ;
// 	}
// 	http.send(res,0,"ok",goods);
// });







/*====================================================================================================== */

// function check_null_value(reqdata,parms){	
// 	parms.forEach(function(element) {		
// 		var value = reqdata[element];
// 		if( value == null || value == "" )
// 		{
// 			return false;
// 		}
// 	}, this);
// 	return true;
// };

// function check_token_privilege (token,level)
// {
// 	if( token == null || token == "")
// 		return null;
// 	if( level == null )
// 		level = 0;
// 	var ret = db.get_dealer_by_token(token); 
// 	if(!ret || ret.privilege_level < level ){
// 		return null;
// 	}
// 	return ret;
// };


// var Person = require('./Person');
// var person = new Person('Jane');
// person.greet();
// console.log(person);
console.log("dealer server is listening on port " + configs.port);