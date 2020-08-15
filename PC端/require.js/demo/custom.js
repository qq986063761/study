//自定义模块的写法
define(["custom1.js"], function(custom1) {
    var add = function(x, y) {　　　　　　
        return x + y + custom1.result();
    };

    return {
    	add:add
    };
});
