'use strict'

String.prototype.format = function(args) {
	var result = this;
	if (arguments.length > 0) {
		if (arguments.length == 1 && typeof (args) == "object") {
			for (var key in args) {
				if(args[key]!=undefined){
					var reg = new RegExp("({" + key + "})", "g");
					result = result.replace(reg, args[key]);
				}
			}
		}
		else {
			for (var i = 0; i < arguments.length; i++) {
				if (arguments[i] != undefined) {
					//var reg = new RegExp("({[" + i + "]})", "g");//这个在索引大于9时会有问题，谢谢何以笙箫的指出
					var reg = new RegExp("({)" + i + "(})", "g");
					result = result.replace(reg, arguments[i]);
				}
			}
		}
	}
	return result;
};

class http_utils
{
	constructor(){
		this.http = require('http');
		this.https = require('https');
		this.qs = require('querystring');
		this.Fiber = require('fibers');
	}

	post(host,port,path,data,callback) {
	
		var content = this.qs.stringify(data);  
		var options = {  
			hostname: host,  
			port: port,  
			path: path + '?' + content,  
			method:'GET'
		};  
		
		var req = this.http.request(options, function (res) {  
			console.log('STATUS: ' + res.statusCode);  
			console.log('HEADERS: ' + JSON.stringify(res.headers));  
			res.setEncoding('utf8');  
			res.on('data', function (chunk) {  
				console.log('BODY: ' + chunk);
				callback(chunk);
			});  
		});
		
		req.on('error', function (e) {  
			console.log('problem with request: ' + e.message);  
		});  
		
		req.end(); 
	};

	get(host,port,path,data,callback,safe) {
		var content = this.qs.stringify(data);  
		var options = {  
			hostname:host,
			path: path + '?' + content,  
			method:'GET'
		};
		if(port){
			options.port = port;
		}
		var proto = this.http;
		if(safe){
			proto = this.https;
		}
		// console.log(options);
		var req = proto.request(options, function (res) {  
			// console.log('STATUS: ' + res.statusCode);  
			// console.log('HEADERS: ' + JSON.stringify(res.headers));  
			res.setEncoding('utf8');
			res.on('data', function (chunk) {  
				// console.log('BODY: ' + chunk);
				var json = JSON.parse(chunk);
				callback(true,json);
			});  
		});
		
		req.on('error', function (e) {  
			console.log('problem with request: ' + e.message);
			callback(false,e);
		});		
		req.end();
	};


	get2(url,data,callback,safe) {
		var fiber = this.Fiber.current;

		var content = this.qs.stringify(data);
		var url = url + '?' + content;
		console.log(url);
		var proto = this.http;
		if(safe){
			proto = this.https;
		}

		var req = proto.get(url, function (res) {  
			console.log('STATUS: ' + res.statusCode);  
			console.log('HEADERS: ' + JSON.stringify(res.headers));  
			res.setEncoding('utf8');  
			res.on('data', function (chunk) {  
				console.log('BODY: ' + chunk);
				var json = JSON.parse(chunk);
				callback(true,json);
				fiber.run();
			});  
		});
		
		req.on('error', function (e) {			
			console.log('problem with request: ' + e.message);
			callback(false,e);
			fiber.run();
		});

		this.Fiber.yield();
		req.end(); 
	};

	/**res,错误编码，错误信息，发送数据 */
	send(res,errcode,errmsg,data){
		if(data == null){
			data = {};
		}
		data.errcode = errcode;
		data.errmsg = errmsg;
		var jsonstr = JSON.stringify(data);
		res.send(jsonstr);
	};
}

module.exports = http_utils;