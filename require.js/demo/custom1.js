//自定义模块，可供其它自定义模块依赖
define(function() {
    var result = function() {　　　　　　
        return 10;
    };
    
    return {
    	result:result
    };
});
