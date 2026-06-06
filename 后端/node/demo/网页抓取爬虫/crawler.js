const http = require('http')
const https = require('https')
const fs = require('fs')
const url = require('url')
const phantom = require('phantom')

// 生成的文件根目录
const root = 'dist'

// 目标网页
let website = 'https://connoratherton.com/loaders' // css3 加载中的 demo 网页
website = 'http://demo.cssmoban.com/cssthemes1/azmind_3_xd/index.html' // 后台模板网页

// 站点的路径分割数组
const websitePathArr = website.replace(/^(http:\/\/|https:\/\/|\/\/)/, '').split('/').slice(1)

// 解析站点
let {protocol, host, path} = url.parse(website, true)

start()

// 开始
async function start() {
  console.log('----------- 开始抓取html ------------')
  
  // 获取html
  getAsset(website, 'html')

  const instance = await phantom.create()
  const page = await instance.createPage()
  await page.open(website)
  const htmlContent = await page.property('content')

  console.log('----------- 开始抓取资源 ------------')
  // 获取其他资源
  download(htmlContent, 'html', 'other')
  
  await instance.exit()
}

// get 请求获取资源
function getAsset(target, type) {
  if (protocol.includes('https')) {
    https.get(target, rs => getAssetCb(rs, type, target))
  } else {
    http.get(target, rs => getAssetCb(rs, type, target))
  }
}

// get 回调
function getAssetCb(rs, type, target) {
  // 二进制文件编码需要注意
  rs.setEncoding(type === 'img' ? 'binary' : 'utf8')

  let data = ''

  rs.on('data', chunk => data += chunk)
  rs.on('end', () => download(data, type, target))
}

/**
 * 下载文件
 * @param {*} 数据
 * @param {*} 文件类型
 * @param {*} 文件所在完整目录
 */
function download(data, type, target) {
  switch (type) {
    case 'html':
      // 其他资源
      if (target === 'other') {
        // 获取 link 标签，下载 css 文件
        traverseDownload(data.match(/<link([\S\s\t]*?)>/gi), 'css')

        // 获取 script 标签，下载 js 文件
        traverseDownload(data.match(/<script([\S\s\t]*?)>/gi), 'js')
        
        // 获取图片标签，下载图片资源
        traverseDownload(data.match(/<img([\S\s\t]*?)>/gi), 'img')
      } else {
        // 下载 html
        // 如果 html 存在目录结构，则按指定目录结构下载文件
        if (path.includes('.html') || path.includes('.htm')) {
          writeFile(path, data)
        } else {
          writeFile('index.html', data)
        }
      }
      break
    case 'css':
    case 'js':
    case 'img':
      writeFile(target.split(`${protocol}//${host}`)[1], data, type)
      break
    default: break
  }
}

/**
 * 遍历下载资源
 * @param {*} tagArr 
 */
function traverseDownload(tagArr, type) {
  if (!tagArr) return

  const regMap = {
    'css': /href=['"]([\S\s\t]*?).css['"]/gi,
    'js': /src=['"]([\S\s\t]*?).js['"]/gi,
    'img': /src=['"]([\S\s\t]*?)['"]/gi
  }

  tagArr.forEach(str => {
    const propArr = str.match(regMap[type])
    if (!propArr) return
    const prop = propArr[0]
    let propVal = prop.split('=')[1]
    propVal = propVal.replace(/['"]/g, '')
    
    if (!propVal.startsWith('http') && !propVal.startsWith('//')) {
      // 根目录下的资源目录
      if (propVal.startsWith('/')) {
        getAsset(`${protocol}//${host + propVal}`, type)
      } else if (propVal.startsWith('./')) {

      } else if (propVal.startsWith('../')) {

      } else {
        let curPath = '/' + websitePathArr.slice(0, websitePathArr.length - 1).join('/') + '/' + propVal
        getAsset(`${protocol}//${host + curPath}`, type)
      }
    }
  })
}

// 写文件
function writeFile(writePath, data, type) {
  let pathArr = writePath.split('/').filter(name => name && name !== '.')
  let fullPath = root
  // 创建根目录
  if (!fs.existsSync(fullPath)) fs.mkdirSync(fullPath)
  // 创建子文件
  for (let index = 0; index < pathArr.length; index++) {
    const name = pathArr[index]
    fullPath += `/${name}`
    // 文件
    if (index === pathArr.length - 1) {
      fs.writeFile(fullPath, data, type === 'img' ? 'binary' : 'utf8', (err) => {
        if (err) {
          console.error(err)
          throw err
        }
        console.log(`文件：${writePath}，下载成功`)
      })
    } else {
      // 目录
      if (!fs.existsSync(fullPath)) fs.mkdirSync(fullPath)
    }
  }
}