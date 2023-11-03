// 字符串模块，常用于字符串和对象的相互处理
const qs = require('querystring')

/**
 * 对象转序列化字符串
 * @param {Object} 对象
 * @param {String} 分割键值对的字符
 * @param {String} 分割键和值的字符
 */
let urlParamStr = qs.stringify({name: 'wanpeng', age: 25}, '&', '=')

/**
 * 序列化字符串转对象
 * @param {String} 对象字符串
 * @param {String} 分割键值对的字符
 * @param {String} 分割键和值的字符
 */
let urlParamObj = qs.parse(urlParamStr, '&', '=')
