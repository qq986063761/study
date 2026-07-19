// aop（面向切面编程），前置
Function.prototype.before = Function.prototype.before || function (action) {
  var func = this;
  return function () {
    action.apply(this, arguments);
    return func.apply(this, arguments);
  };
};

// aop（面向切面编程），后置
Function.prototype.after = Function.prototype.after || function (action) {
  var func = this;
  return function () {
    var result = func.apply(this, arguments);
    action.apply(this, arguments);
    return result;
  };
};