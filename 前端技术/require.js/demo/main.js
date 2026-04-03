//配置requireJS的模块
require.config({
	baseUrl:"../", //配置基本的父路径
	paths:{
		//配置对应的模块的映射,key值是自定义的值，value值是基目录下的js不带后缀名的文件,也可以是数组将会加载数组中能加载成功的路径
		"jquery":["http://libs.baidu.com/jquery/2.0.3/jquery","jquery-2.2.4.min"],
		'Bootstrap':['http://cdn.bootcss.com/bootstrap/3.3.0/js/bootstrap.min.js']
	},
	shim:{ 
		'jquery':{
			exports:'$' //对外暴露的调用对象名
		},
		'Bootstrap':{
			deps: ['jquery'] //所依赖的其它模块
		}
　　},
	//防止模块加载超时
	waitSeconds:0 
});

// 导入配置的对应的模块,并在回调中对应位置配置简称
require(["jquery", "custom.js"], function($, custom){
	$(function(){
		alert("main模块测试");
		alert(custom.add(1,2)); //自定义的模块导入使用
	});
});
