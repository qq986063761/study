// url模块，常用于解析url
const url = require('url')

/**
 * 拼接url字符串
 */
let urlStr = url.resolve('http://172.25.50.125:8080/', '/note/addNote.json?name=wanpeng&age=23#version=1.3.0')

/**
 * 解析url字符串参数
 * @param {String} url
 * @param {Boolean} 是否用querystring模块解析成json对象
 */
let urlObj = url.parse(urlStr, true)