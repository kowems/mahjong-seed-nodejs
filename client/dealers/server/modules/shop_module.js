'use strict'
var base_module = require("./base_module");
// import * as base_module from "./base_module";
class shop_module extends base_module
{
	constructor(){
		super();		
	}	

	service(){
		this.app.get('/get_goods',function (req,res,next){
				this.get_goods(req,res,next);
			}.bind(this) );

        this.app.get('/buy_goods',function (req,res,next){
            this.buy_goods(req,res,next);
        }.bind(this) );

        this.app.get('/get_buy_goods_log',function (req,res,next){
            this.get_buy_goods_log(req,res,next);
        }.bind(this) );

        this.app.get('/get_goods_all',function (req,res,next){
				this.get_goods_all(req,res,next);
			}.bind(this) );

        this.app.get('/add_goods',function (req,res,next){
            this.add_goods(req,res,next);
        }.bind(this) );

        this.app.get('/update_goods',function (req,res,next){
            this.update_goods(req,res,next);
        }.bind(this) );

        this.app.get('/dec_goods',function (req,res,next){
            this.dec_goods(req,res,next);
        }.bind(this) );

    };

    dec_goods(req,res){

         var token = req.query.token;
         var gid = req.query.gid;

        if(this.checkNullValue([token,gid])){
            this.send(res,-1,"unknown error.");
            return;
        }
        var ret = this.checkTokenAndPrivilege(token,1000); 
        if(!ret){
            this.send(res,12580,"token check failed.");
            return;
        }

        var rows = this.deleteGoods(gid);
        if( !rows )
        {
            this.send(res,1,"Unknown error.");
            return ;
        }
        this.send(res,0,"ok"); 
    };

    update_goods(req,res){

         var token = req.query.token;
         var gid = req.query.gid;
         var goodsName = req.query.goodsName;
         var gtype = req.query.goodsType;
         var gnum = req.query.goodsNum;
         var price = req.query.price;
         var ptype = req.query.priceType;
         var state = req.query.state;
         var act = req.query.act;
         var end = req.query.end;

        if(this.checkNullValue([token,gid,goodsName,gtype,gnum,price,
                                ptype,state,act,end])){
            this.send(res,-1,"unknown error.");
            return;
        }
        var ret = this.checkTokenAndPrivilege(token,1000); 
        if(!ret){
            this.send(res,12580,"token check failed.");
            return;
        }

        var rows = this.updateGoods(gid,name,gtype,num,price,ptype,state,act,end);
        if( !rows )
        {
            this.send(res,1,"Unknown error.");
            return ;
        }
        this.send(res,0,"ok"); 
    };

    add_goods(req,res){

         var token = req.query.token;
         var goodsName = req.query.goodsName;
         var gtype = req.query.goodsType;
         var gnum = req.query.goodsNum;
         var price = req.query.price;
         var ptype = req.query.priceType;
         var state = req.query.state;
         var act = req.query.act;
         var end = req.query.end;

        if(this.checkNullValue([token,goodsName,gtype,gnum,price,
                                ptype,state,act,end])){
            this.send(res,-1,"unknown error.");
            return;
        }
        var ret = this.checkTokenAndPrivilege(token,1000); 
        if(!ret){
            this.send(res,12580,"token check failed.");
            return;
        }

        var rows = this.addGoods(name,gtype,num,price,ptype,state,act,end);
        if( !rows )
        {
            this.send(res,1,"Unknown error.");
            return ;
        }
        this.send(res,0,"ok"); 
    };

    get_goods_all(req,res){
        var token = req.query.token;

        if(this.checkNullValue([token])){
            this.send(res,-1,"unknown error.");
            return;
        }
        var ret = this.checkTokenAndPrivilege(token,1000); 
        if(!ret){
            this.send(res,12580,"token check failed.");
            return;
        }

        var goods = this.getGoodsAll();
        if( !goods )
        {
            this.send(res,1,"Unknown error.");
            return ;
        }
        this.send(res,0,"ok",goods);
    };

    get_buy_goods_log(req,res){
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
        var goods = this.getBuyGoodsLog(ret.account,start,rows);
        if( !goods )
        {
            this.send(res,1,"Unknown error.");
            return ;
        }
        this.send(res,0,"ok",goods);
    };


    buy_goods(req,res){
        var token = req.query.token;
        var id = req.query.id;

        if(this.checkNullValue([token,id])){
            this.send(res,-1,"unknown error.");
            return;
        }

        var ret = this.getDealerByToken(token); 
        if(!ret){
            this.send(res,12580,"token check failed.");
            return;
        }

        var goods = this.getGoodsId(id);
        if( !goods )
        {
            this.send(res,1,"Unknown error.");
            return ;
        }
        
        //获得价格 货币 0，RMB  1:积分 2：房卡 
        if( goods.price_type == 1 )
        {
            if( goods.price > ret.score )
            {
                this.send(res,2,"lack of score");
                return ;
            }
        }else if( goods.price_type == 2)
        {
            if( goods.price > ret.gems )
            {
                this.send(res,2,"lack of gems");
                return ;
            }
        }else
        {
            this.send(res,1,"Unknown error.");
            return ;
        }

        //购买逻辑
        if( this.buyGoodsLog(ret.account,goods.goods_type,goods.goods_num,goods.goods_price,goods.price_type,Date.now()) )
        {
            var payed = false;
            if( goods.price_type == 1 )
            {
                //扣除积分
                payed = this.decDealerScore(ret.account,goods.goods_price);
            }else if( goods.price_type == 2)
            {
                //扣除房卡
                payed = this.decDealerGems(ret.account,goods.goods_price);
            }

            if(payed)
            {
                payed = false;
                //增加购买物品
                if( goods.goods_type == 1 )
                {
                    //增加房卡
                    payed = this.addDealerGems(ret.account,goods.goods_num);
                }else if( goods.goods_type == 2)
                {
                    //增加积分
                    payed = this.addDealerScore(ret.account,goods.goods_num);
                }

                if( payed )
                {
                    this.send(res,0,"OK",{goods_type:goods.goods_type,goods_num:goods.goods_num});
                }else{
                    this.send(res,4,"buy failed");
                }

            }else{
                //扣款失败
                this.send(res,3,"pay failed.");
                return ;
            }
        }else{
            this.send(res,5,"system error");
        }
        
    };

    get_goods(req,res){
        var token = req.query.token;

        if(this.checkNullValue([token])){
            this.send(res,-1,"unknown error.");
            return;
        }
        var ret = this.getDealerByToken(token); 
        if(!ret){
            this.send(res,12580,"token check failed.");
            return;
        }

        var goods = this.getGoods();
        if( !goods )
        {
            this.send(res,1,"Unknown error.");
            return ;
        }
        this.send(res,0,"ok",goods);
    };
	

//=====================================================================
   deleteGoods(id){
        var sql = 'DELETE FROM t_dealers_goods where id={0}';
        sql = sql.format(id);
        var ret = this.query(sql);
        if(ret.err){
            console.log(ret.err);
            return false;
        }
        else{
            return ret.rows.affectedRows > 0;
        }
   }

   updateGoods(id,name,gtype,num,price,ptype,state,act,end){
       var sql = 'UPDATE t_dealers_goods SET  goods_name = "{0}",goods_type = {1},goods_num = {2},goods_price = {3},price_type = {4},state = {5},act_time = {6},end_time = {7} WHERE id = {8}';
        sql = sql.format(name,gtype,num,price,ptype,state,act,end,id);
        var ret = this.query(sql);
        if(ret.err){
            console.log(ret.err);
            return false;
        }
        else{
            return ret.rows.affectedRows > 0;
        }
   }

   addGoods(name,gtype,num,price,ptype,state,act,end){
       var sql = 'INSERT INTO t_dealers_goods (goods_name,goods_type,goods_num,goods_price,price_type,state,act_time,end_time) VALUES("{0}",{1},{2},{3},{4},{5},{6},{7})';
        sql = sql.format(name,gtype,num,price,ptype,state,act,end);
        var ret = this.query(sql);
        if(ret.err){
            console.log(ret.err);
            return false;
        }
        else{
            return ret.rows.affectedRows > 0;
        }
   }
   
     /**获得所有商品 */
    getGoodsAll(){        
        var sql = 'SELECT * FROM t_dealers_goods ORDER BY act_time DESC';
        var ret = this.query(sql);
        if(ret.err){
            console.log(ret.err);
            return null;
        }
        else{
            if(ret.rows.length == 0){
                return null;
            }
            return ret.rows;
        }
    };

    /**获得可用商品 */
    getGoods(){
        var nowtime = Date.now;
        var sql = 'SELECT * FROM t_dealers_goods WHERE act_time <= {0} AND ( end_time > {1} OR end_time = -1 ) AND state = 1 ORDER BY act_time DESC';
        sql = sql.format(nowtime,nowtime);
        var ret = this.query(sql);
        if(ret.err){
            console.log(ret.err);
            return null;
        }
        else{
            if(ret.rows.length == 0){
                return null;
            }
            return ret.rows;
        }
    };

    /**获得可用商品 根据ID*/
    getGoodsId(id){
        var nowtime = Date.now;
        var sql = 'SELECT * FROM t_dealers_goods WHERE act_time <= {0} AND ( end_time > {1} OR end_time = -1 ) AND state = 1 AND id = {2} ORDER BY act_time DESC';
        sql = sql.format(nowtime,nowtime,id);
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


    /**商品购买记录 */
    buyGoodsLog(account,goodsType,goodsNum,goodPrice,priceType,time){
        var sql = 'INSERT INTO t_buy_goods_log(account,goods_type,goods_num,goods_price,price_type,time) VALUES("{0}",{1},{2},{3},{4},{5})';
        sql = sql.format(account,goodsType,goodsNum,goodPrice,priceType,time);
        var ret = this.query(sql);
        if(ret.err){
            console.log(ret.err);
            return false;
        }
        else{
            return ret.rows.affectedRows > 0;
        }
    };


    /**查询购买记录 */
    getBuyGoodsLog(account,start,rows){
        if( !account || account == "")    
            return null;
        var sql = 'SELECT * FROM t_buy_goods_log where account="{0}" ORDER BY time DESC limit {1},{2}';
        sql = sql.format(account,start,rows);
        var ret = this.query(sql);
        if(ret.err){
            console.log(ret.err);
            return null;
        }
        else{
            return ret.rows;
        }
    };
	
}

module.exports = shop_module;