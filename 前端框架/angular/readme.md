# 资源
- [中文官网](https://angular.cn/);

# 依赖注入
- 开发者只用关注使用服务，内部实现、服务是否依赖了其他服务由依赖注入机制处理；

# angular1.x 脏检查
- 视图更新通常会在用户交互、定时器、生命周期等时机更新，所以这些时机之后，angular 会计算数据的新值和旧值是否不同
- 新旧值不同，会更新页面，然后触发下一次脏检查，直到数据没变化或者超过脏检查限制最大次数则停止
- 缺点：性能低下