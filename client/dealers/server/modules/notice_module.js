'use strict'
var base_module = require("./base_module");
// import * as base_module from "./base_module";
class notice_module extends base_module
{
	constructor(){
		super();		
	}	

	service(){
		this.app.get('/get_notice',function (req,res,next){
				this.get_notice(req,res,next);
			}.bind(this) );
        
        this.app.get('/get_notice_all',function (req,res,next){
				this.get_notice_all(req,res,next);
			}.bind(this) );

         this.app.get('/update_notice',function (req,res,next){
				this.update_notice(req,res,next);
			}.bind(this) );

        this.app.get('/add_notice',function (req,res,next){
				this.add_notice(req,res,next);
			}.bind(this) );

        this.app.get('/delete_notice',function (req,res,next){
            this.delete_notice(req,res,next);
            }.bind(this) );
    };

    

    delete_notice(req,res){
        var token = req.query.token;
        var id = req.query.id;

        if( check_null_value([token,id]) ){
            this.send(res,-1,"unknown error.");
            return;
        }

        var ret = this.checkTokenAndPrivilege(token,1000);
        if(!ret)
        {
            this.send(res,12580,"token check failed.");
            return;
        }

        var notice = this.deleteNotice(id);
        if( !notice )
        {
            this.send(res,1,"Unknown error.");
            return ;
        }
        this.send(res,0,"ok");
    };

    add_notice(req,res){
        var token = req.query.token;
        var id = req.query.id;
        var title = req.query.title;
        var content = req.query.content;
        var level = req.query.level;
        var actTime = req.query.actTime;
        var endTime = req.query.endTime;

        if(this.checkNullValue([token,id,title,content,level,actTime,endTime])){
            this.send(res,-1,"unknown error.");
            return;
        }
        var ret = this.getDealerByToken(token); 
        if(!ret || ret.privilege_level < 1000 ){
            this.send(res,12580,"token check failed.");
            return;
        }

        var notice = this.insertNotice(id,title,content,level,actTime,endTime);
        if( !notice )
        {
            this.send(res,1,"Unknown error.");
            return ;
        }
        this.send(res,0,"ok");
    };

    update_notice(req,res){
        var token = req.query.token;
        var id = req.query.id;
        var title = req.query.title;
        var content = req.query.content;
        var level = req.query.level;
        var actTime = req.query.actTime;
        var endTime = req.query.endTime;

        if(this.checkNullValue([token,id,title,content,level,actTime,endTime])){
            this.send(res,-1,"unknown error.");
            return;
        }

        var ret = this.getDealerByToken(token); 
        if(!ret || ret.privilege_level < 1000 ){
            this.send(res,12580,"token check failed.");
            return;
        }

        var notice = this.updateNotice(id,title,content,level,actTime,endTime);
        if( !notice )
        {
            this.send(res,1,"Unknown error.");
            return ;
        }
        this.send(res,0,"ok");
    };

    get_notice_all(req,res,next){
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
        var notice = this.getNoticeAll();
        if( !notice )
        {
            this.send(res,1,"Unknown error.");
            return ;
        }
        this.send(res,0,"ok",notice);
    };

	get_notice(req,res,next){
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

        var notice = this.getNotice();
        if( !notice )
        {
            this.send(res,1,"Unknown error.");
            return ;
        }
        this.send(res,0,"ok",notice);
	};

//=====================================================================

	/**获得公告信息 常规*/
    getNotice(){    
        var nowtime = Date.now;
        var sql = 'SELECT * FROM t_dealers_notice WHERE act_time <= {0} AND ( end_time > {1} OR end_time = -1 ) ORDER BY act_time DESC';
        sql = sql.format(nowtime,nowtime);
        var ret = this.query(sql);
        if(ret.err){
            console.log(ret.err);
            return null;
        }
        else{        
            return ret.rows;
        }
    };

    /**获得公告信息 管理*/
    getNoticeAll(){        
        var sql = 'SELECT * FROM t_dealers_notice ORDER BY act_time DESC';
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

    /**更新公告信息 管理*/
    updateNotice(id,title,content,level,actTime,endTime){        
        var sql = 'UPDATE t_dealers_notice SET title = "{0}",content = "{1}",level = {2},act_time = {3},end_time = {4} where id = {5}';
        sql = sql.format(title,content,level,actTime,endTime,id);
        var ret = this.query(sql);
        if(ret.err){
            console.log(ret.err);
            return false;
        }
        else{
            return ret.rows.affectedRows > 0;
        }
    };


    /**新增公告信息*/
    insertNotice(title,content,level,actTime,endTime) {
        var sql = 'INSERT INTO t_dealers_notice(title,content,level,act_time,end_time) VALUES("{0}","{1}",{2},{3},{4})';
        sql = sql.format(title,content,level,actTime,endTime);
        var ret = this.query(sql);
        if(ret.err){
            console.log(ret.err);
            return false;
        }
        else{
            return ret.rows.affectedRows > 0;
        }
    };


    /**删除公告信息*/
    deleteNotice(id) {
        var sql = 'DELETE FROM t_dealers_notice where id={0}';
        sql = sql.format(id);
        var ret = this.query(sql);
        if(ret.err){
            console.log(ret.err);
            return false;
        }
        else{
            return ret.rows.affectedRows > 0;
        }
    };
}

module.exports = notice_module;