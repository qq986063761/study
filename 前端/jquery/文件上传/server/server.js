var http = require('http');
var url = require('url');
var qs = require('querystring');

//简单配置路由
var route = {
    '/': "/",
    'favicon': '/favicon.ico',
    'user': '/user',
    'login': '/user/login',
    'biz': '/biz'
};

/**
 * 上述路由的简单校验规则,用于错误页面请求校验
 * @param reqPath
 * @returns {boolean}
 */
var isValid = function (reqPath) {
    for (var key in route) {
        if (route[key] == reqPath) {
            return true;
        }
    }
    return false;
};

/**
 * 返回json格式的数据
 * @param query
 * @param res
 */
var writeOut = function (query,res) {
    res.write(JSON.stringify(query));
    res.end();
};

//创建服务
var server = http.createServer(function(req, res){
	//响应头配置,如果参数1写404则直接进入客户端的error
	res.writeHead(200, {
		'Content-Type': 'text/plain;charset=utf-8',
		'Access-Control-Allow-Origin': '*',
 		'Access-Control-Allow-Headers': 'X-Requested-With',
 		'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
 		'X-Powered-By': '3.2.1'
	});
	
	//校验请求url是否是正确服务
	if (!isValid(url.parse(req.url).pathname)) {
		//响应数据调用方法JSON.stringify返回的数据在客户端则会收到json格式的对象
        res.write(JSON.stringify({"message":"{'errcode':404,'errmsg':'404 页面不见啦'}"}));
        //告诉服务器响应头和主体都已被发送完毕
        res.end();
    } else {
       	//判断请求类型
        if (req.method.toUpperCase() == 'POST') {
            var postData = "";
            
            //因为post方式的数据不太一样可能很庞大复杂，所以要添加监听来获取传递的数据
            req.on("data", function (data) {
                postData += data;
            });
            
            //数据请求完毕
            req.on("end", function () {
                var query = qs.parse(postData);
                query.message = '响应完成!';
                writeOut(query, res);
            });
        }
        else if (req.method.toUpperCase() == 'GET') {
            //解析url成json对象
            var query = url.parse(req.url, true).query;
            query.message = '响应完成!';
            writeOut(query, res);
        } else {
            //head put delete options etc.
        }
    }
 	
 	//超时
 	res.setTimeout(3000, function(){
 		res.end(JSON.stringify({"message":"响应超时..."}));
 	});
});

//客户端请求error触发
server.on('clientError',function(err, socket){
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});

//指定监听的信息(端口号，主机)
server.listen(8000,'127.0.0.1',function(){
	console.info('server listening...；port：8000');
});