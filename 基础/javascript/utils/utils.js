// 匹配浏览器系统信息
function userAgent(pattern) {
	if (typeof window !== 'undefined' && window.navigator) {
		return !!/*@__PURE__*/navigator.userAgent.match(pattern);
	}
}

// 获取浏览器类型
function getBrowser() {
  var webInfo = navigator.userAgent;
  var chromeVendor = navigator.vendor;
  if (webInfo.indexOf("OPR") !== -1) {
    return "Opera";
  } else if (webInfo.indexOf("Edge") !== -1) {
    return "Edge";
  } else if (webInfo.indexOf("Firefox") !== -1) {
    return "FF";
  } else if (webInfo.indexOf("MSIE 9.0") !== -1) {
    return "IE9";
  } else if (webInfo.indexOf("MSIE 10.0") !== -1) {
    return "IE10";
  } else if (webInfo.indexOf("Trident") !== -1) {
    return "IE11";
  } else if (
    (chromeVendor !== "" &&
      chromeVendor !== undefined &&
      chromeVendor !== null &&
      chromeVendor.indexOf("Google") !== -1) ||
    webInfo.indexOf("Chrome") !== -1
  ) {
    return "Chrome";
  } else if (webInfo.indexOf("Safari") !== -1) {
    return "Safari";
  } else {
    return "other";
  }
}

// 获取浏览器滚动条的宽度
let scrollBarWidth = null;
function getScrollBarWidth() {
  if (scrollBarWidth !== null) return scrollBarWidth;

  const outer = document.createElement("div");
  outer.className = "el-scrollbar__wrap";
  outer.style.visibility = "hidden";
  outer.style.width = "100px";
  outer.style.position = "absolute";
  outer.style.top = "-9999px";
  document.body.appendChild(outer);

  const widthNoScroll = outer.offsetWidth;
  outer.style.overflow = "scroll";

  const inner = document.createElement("div");
  inner.style.width = "100%";
  outer.appendChild(inner);

  const widthWithScroll = inner.offsetWidth;
  outer.parentNode.removeChild(outer);
  scrollBarWidth = widthNoScroll - widthWithScroll;

  return scrollBarWidth;
}

/**
 * 窗口关闭或刷新事件，不应该在回调中发起请求，可以缓存数据
 * @param {function} callback 回调
 */
function onCloseWin(callback) {
  if (!callback) {
    alert('需要回调作为参数');
    return;
  }

  var userAgent = navigator.userAgent; // 取得浏览器的userAgent字符串  
  var isOpera = userAgent.indexOf("Opera") > -1; // 判断是否Opera浏览器  
  var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera; // 判断是否IE浏览器
  var isIE11 = userAgent.indexOf("rv:11.0") > -1; // 判断是否是IE11浏览器
  var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器

  // 兼容chrome和firefox
  if (!isIE && !isEdge && !isIE11) {
    var _beforeUnload_time = 0;
    var _gap_time = 0;
    var is_fireFox = navigator.userAgent.indexOf("Firefox") > -1; // 是否是火狐浏览器

    // 关闭
    window.onunload = function () {
      _gap_time = new Date().getTime() - _beforeUnload_time;
      if (_gap_time < 5) {
        // 浏览器关闭
        callback(0);
      } else {
        // 刷新
        callback(1);
      }
    }

    // 关闭之前
    window.onbeforeunload = function () {
      _beforeUnload_time = new Date().getTime();
      // 火狐关闭执行
      if (is_fireFox) {
        //浏览器关闭
        callback(0);
      }
    };
  } else {
    // ie
    window.onbeforeunload = function () {
      // 关闭前
      callback(0);
    }

    window.onunload = function () {
      // 关闭
      callback(0);
    }
  }
}

// 检测 flash 状态
function getFlashInfo() {
  /*是否安装了flash*/
  var hasFlash = 0,
    /*flash版本*/
    flashVersion = 0,
    /*是否IE浏览器*/
    isIE = (!!window.ActiveXObject) || (!!navigator.userAgent.match(/Trident.*rv\:11\./));

  if (isIE) {
    try {
      var swf = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
      if (swf) {
        hasFlash = 1;
        flashVersion = swf.GetVariable("$version");

        /* 转换为数字 */
        flashVersion = flashVersion.toString().split(',')[0];
        flashVersion = Number(flashVersion.replace(/[^\d]+/, ''));
      }
    } catch (e) {}
  } else {
    if (navigator.plugins && navigator.plugins.length > 0) {
      var swf = navigator.plugins['Shockwave Flash'];

      if (swf) {
        var desc = swf.description.split(' ');

        hasFlash = 1;

        /*获取版本号，一般情况*/
        for (var i = 0; i < desc.length; i++) {
          if (Number(desc[i]) > 0) {
            flashVersion = Number(desc[i]);
            break;
          }
        }
      }
    }
  }

  return {
    hasFlash: !!hasFlash,
    ver: flashVersion
  };
}

/**
 * 设置 sessionStorage 对象缓存
 * @param {string} key
 * @param {object} 需要覆盖的数据
 */
function setSession(key, params) {
  if (typeof params === 'number' || typeof params === 'string') {
    alert('基本类型请直接使用 sessionStorage.setItem');
    return;
  }
  const cache = this.getSession(key);
  sessionStorage.setItem(key, JSON.stringify(Object.assign(cache || {}, params || {})));
}

// 获取 sessionStorage 缓存
function getSession(key) {
  return JSON.parse(sessionStorage.getItem(key));
}

// 设置 localStorage 对象缓存
function setLocal(key, params) {
  if (typeof params === 'number' || typeof params === 'string') {
    alert('基本类型请直接使用 localStorage.setItem');
    return;
  }
  const cache = this.getLocal(key);
  localStorage.setItem(key, JSON.stringify(Object.assign(cache || {}, params || {})));
}

// 获取 localStorage 缓存
function getLocal(key) {
  return JSON.parse(localStorage.getItem(key));
}

// 图片文件转 base64
function file2Base64(file, cb) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = function(event) {
      resolve(event.target.result)
      cb && cb(event.target.result)
    }
  })
}

// 图片 url 转 base64
function imgToBase64(url, outputFormat) {
  let canvas;
  function initCanvas() {
    if (!canvas) {
      canvas = document.createElement('canvas')
    }
    return canvas
  }

  function loadImg(src) {
    let img = new Image()
    img.crossOrigin = 'Anonymous'
    img.src = src
    
    return new Promise((resolve, reject) => {
      img.onload = function() {
        resolve(img)
      }
      img.onerror = function(error) {
        reject(error)
      }
    })
  }

  function toBase64(img, outputFormat) {
    let ctx = canvas.getContext('2d')
    canvas.width = img.width
    canvas.height = img.height
    ctx.drawImage(img, 0, 0)
    return canvas.toDataURL(outputFormat || 'image/jpg')
  }

  initCanvas()
  if (!canvas.toDataURL || typeof canvas.toDataURL !== 'function') {
    throw new Error('method not supported')
  }

  return loadImg(url).then(img => {
    return toBase64(img, outputFormat)
  }).catch(err => {
    console.warn(err)
  })
}

// base64 => file
// # 如果想要预览转出来的图片可以：
// const fileReader = new FileReader();  // 创建一个 fileReader
// fileReader.readAsDataURL(imgFile); // 将生成的图片文件读到 fileReader中
// const img = new Image();
// img.src = fileReader.result; // 将 fileReader.result 设置为 图片的 src
// document.body.appendChild(img);
function dataURLtoFile(dataurl, filename = 'file') {
  let arr = dataurl.split(',')
  let mime = arr[0].match(/:(.*?);/)[1]
  let suffix = mime.split('/')[1]
  let bstr = atob(arr[1])
  let n = bstr.length
  let u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], `${filename}.${suffix}`, {
    type: mime
  })
}

// 获取 url 上的 query 参数
function getUrlQuery() {
  let searchUrl = location.search.slice(1).split('#')[0]
  const arr = searchUrl.split('&')
  const obj = {}
  arr.forEach(str => {
    const index = str.indexOf('=')
    if (index !== -1) {
      const key = str.slice(0, index)
      const value = str.slice(index + 1)
      obj[key] = value
    }
  })
  return obj
}