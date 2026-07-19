// 校验工具
var validator = {
  /**
   * 是否为空
   * @param {*} val 输入值 
   */
  isEmpty: function (val) {
    return (val === undefined || val === null || val.length === 0 || val.trim().length === 0 ? true : false);
  },
  /**
   * 是否都是数字
   * @param {String} val 输入值 
   */
  isBothNumber: function (val) {
    return /^\d+$/.test(val);
  },
  /**
   * 是否都是字母
   * @param {String} val 输入值 
   */
  isBothLetter: function (val) {
    return /^[a-zA-Z]+$/.test(val);
  },
  /**
   * 是否是数值
   * @param {String} val 输入值
   */
  isNumber: function (val) {
    return !isNaN(Number(val));
  },
  /**
   * 是否是手机号码
   * @param {String} val 输入值
   */
  isMobile: function (val) {
    return this.isBothNumber(val) && /^1\d{10}$/.test(val);
  },
  /**
   * 是否是座机号码
   * @param {String} val 输入值
   */
  isTelephone: function (val) {
    return this.isBothNumber(val) && /^([0-9]{3,4}-)?[0-9]{7,8}$/.test(val);
  },
  /**
   * 是否是邮箱
   * @param {String} val 输入值
   */
  isEmail: function (val) {
    return /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(val);
  },
  /**
   * 是否是身份证
   * @param {String} val 输入值
   */
  isIdCard: function (val) {
    return (
      /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X|x)$/.test(val)
      && IdentityCodeValid(val));
  },
  /**
   * 是否是url
   * @param {String} val 输入值
   */
  isUrl: function (val) {
    return /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/.test(val);
  },
  /**
   * 字符串长度是否在最小至最大之间（包含）
   * @param {String} val 输入值 必选
   * @param {Number} min 最小长度 可选
   * @param {Number} max 最大长度 可选
   */
  isInLengthRange: function (val, min, max) {
    return (val.length >= (min || 0) && val.length <= (max || 99999));
  },
  /**
   * 数值是否在最小值至最大值之间（包含）
   * @param {Number} val 输入值 必选
   * @param {Number} min 最小值 可选
   * @param {Number} max 最大值 可选
   */
  isInNumberRange: function (val, min, max) {
    val = parseFloat(val);
    return (val >= (min || -99999) && val <= (max || 99999));
  },
  /**
   * @param {String} val 输入值 必选
   * @param {Number} level 安全等级 可选 0：全数字或全字母，1：字母+数字，2：大写小写字母+数字，3：大写小写字母+数字+特殊符号 默认0
   */
  isPassword: function (val, level) {
    level = level || 0;
    switch (level) {
      case 0:
        return this.isBothNumber(val) || this.isBothLetter(val);
      case 1:
        return /^[a-zA-Z]+\d+/.test(val);
      case 2:
        return /^[A-Z]+[a-z]+\d+/.test(val);
      case 3:
        return /^[A-Z]+[a-z]+\d+[~!@#$%^&*()_+]+/.test(val);
    }
  },
  /**
   * 是否是utf16字符，常用于判断输入法表情
   */
  isUtf16() {
    var reg = /[\ud800-\udbff][\udc00-\udfff]/g;
    var result = reg.test(this);
    return result;
  },
  /**
   * 是否是中文
   */
  isChinese(str) {
    return (/[\u4e00-\u9fa5]+/g).test(str)
  }
}

// 身份证详情校验
function IdentityCodeValid(code) {
  var city = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江 ", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏 ", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外" };
  var tip = "";
  var pass = true;

  if (!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X|x)$/i.test(code)) {
    tip = "身份证号格式错误";
    pass = false;
  } else if (!city[code.substr(0, 2)]) {
    tip = "地址编码错误";
    pass = false;
  } else {
    //18位身份证需要验证最后一位校验位
    if (code.length == 18) {
      code = code.split('');
      //∑(ai×Wi)(mod 11)
      //加权因子
      var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
      //校验位
      var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
      var sum = 0;
      var ai = 0;
      var wi = 0;
      for (var i = 0; i < 17; i++) {
        ai = code[i];
        wi = factor[i];
        sum += ai * wi;
      }
      var last = parity[sum % 11];
      if ((parity[sum % 11] + '').toLowerCase() != code[17].toLowerCase()) {
        tip = "校验位错误";
        pass = false;
      }
    }
  }

  return pass;
}