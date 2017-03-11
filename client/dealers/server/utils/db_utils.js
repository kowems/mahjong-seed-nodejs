'use strict'
class db_utils{

    constructor(){
		this.mysql = require('mysql');
        this.Fiber = require('fibers');
        this.pool = null;
	}

    init(config){
        this.pool = this.mysql.createPool({  
            host: config.HOST,
            user: config.USER,
            password: config.PSWD,
            database: config.DB,
            port: config.PORT,
        });
    };

    nop(a,b,c,d,e,f,g){

    }

    query(sql){
        var fiber = this.Fiber.current;
        var ret = {
            err:null,
            rows:null,
            fields:null,
        };

        this.pool.getConnection(function(err,conn){  
            if(err){
                ret.err = err;
                fiber.run();
            }else{  
                conn.query(sql,function(qerr,vals,fields){  
                    //释放连接  
                    conn.release();
                    ret.err = qerr;
                    ret.rows = vals;
                    ret.fields = fields;
                    fiber.run();
                });  
            }  
        });
        this.Fiber.yield();
        return ret;
    };
}

module.exports = db_utils;