/**
 * Date格式化字符串("yyyy-MM-dd hh:mm:ss.S"=>"2006-7-2 8:9:4.18")
 * @param {String} fmt 日期的字符串格式规则
 * @return {String} 格式化后的字符串
 */
Date.prototype.format = Date.prototype.format || function (fmt) {
  // 转成中国时区对应的时间，将当前客户端时差和中国时差的差补上后得出新的 date 对象
  const date = new Date(this.getTime() + (new Date().getTimezoneOffset() - (-480)) * 60 * 1000)
  
  var o = {
    "M+": date.getMonth() + 1,                 // 月份
    "d+": date.getDate(),                    // 日
    "h+": date.getHours(),                   // 小时
    "m+": date.getMinutes(),                 // 分
    "s+": date.getSeconds(),                 // 秒
    "q+": Math.floor((date.getMonth() + 3) / 3), // 季度
    "S": date.getMilliseconds()             // 毫秒
  };

  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  }

  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  }

  return fmt;
};

/**
 * 比较日期差值
 * @param {string} type 类型，相差数据的单位（年：y，月：M，日：d，时：h，分：m，秒：s，周：w）
 * @param {date} end 结束时间，日期格式字符串或者日期对象
 */
Date.prototype.getDiff = Date.prototype.getDiff || function (type, end) {
  var start = this;
  if (typeof end == 'string') { //如果是字符串转换为日期型
    end = end.toDate(); // 依赖字符串的自定义toDate方法
  }
  switch (type) {
    case 's':
      return parseInt((end - start) / 1000);
    case 'm':
      return parseInt((end - start) / 60000);
    case 'h':
      return parseInt((end - start) / 3600000);
    case 'd':
      return parseInt((end - start) / 86400000);
    case 'w':
      return parseInt((end - start) / (86400000 * 7));
    case 'M':
      return (end.getMonth() + 1) + ((end.getFullYear() - start.getFullYear()) * 12) - (start.getMonth() + 1);
    case 'y':
      return end.getFullYear() - start.getFullYear();
  }
};

// 获取日期对应的周信息
const weekCh = [, '一', '二', '三', '四', '五', '六']
Date.prototype.getWeekInfo = Date.prototype.getWeekInfo || function () {
  const date = this
  const weekday = date.getDay()
  const weekno = Math.ceil((date.getDate() + (weekday ? (7 - weekday) : 0)) / 7)

  return {
    weekNo: weekno,
    weekNoCh: weekCh[weekno]
  }
}