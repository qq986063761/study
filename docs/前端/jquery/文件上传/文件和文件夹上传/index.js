var $file = $('#upload');
var $container = $('#container');

Date.prototype.format = Date.prototype.format || function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };

    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));

    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));

    return fmt;
};

// 文件夹上传
$file.on("change", function (e) {
    var files = this.files;
    for (var i = 0, file; file = files[i]; i++) {
        // 获取文件信息
        var fileName = file.name;
        var createDate = new Date().format('yyyy-MM-dd');

        // 获取文件夹的每一级路径名数组
        var pathNameArr = file.webkitRelativePath.split('/');

        // 对文件夹路径进行解析
    }
});

// 获取缩略图路径
function getImgSrcByFileType(fileType) {
    var base = '../';
    switch (fileType) {
        case "txt":
            return base + 'images/icon－txt.svg';
        case "rar":
            return base + 'images/icon－rar.svg';
        case "zip":
            return base + 'images/icon－zip.svg';
        case "doc":
            return base + 'images/icon－word.svg';
        case "ppt":
            return base + 'images/icon－ppt.svg';
        case "xls":
            return base + 'images/icon－excle.svg';
        case "pdf":
            return base + 'images/icon－pdf.svg';
        case "img":
            return 'img';
        case 'unKnown':
            return base + 'images/icon－weizhiwenjian0.svg';
    }
}

//转换字节为对应满足的内存大小字符串
function getSizeStrByBit(fileSize) {
    return (fileSize > 1024 * 1024) ? (Math.round(fileSize / 1024 / 1024 * 100) / 100 + "M") : ((fileSize > 1024) ? (Math.round(fileSize / 1024 * 100) / 100 + "KB") : (fileSize + "B"));
}

// 获取文件类型
function getFileType(fileName) {
    var extName = fileName && fileName.substr(fileName.lastIndexOf(".") + 1) || '';
    extName = extName.toLowerCase();

    switch (extName) {
        case "txt":
            return 'txt';
        case "rar":
            return 'rar';
        case "zip":
            return 'zip';
        case "doc":
        case "docx":
        case "rtf":
            return 'doc';
        case "ppt":
        case "pptx":
            return 'ppt';
        case "xls":
        case "xlsx":
            return 'xls';
        case "pdf":
            return 'pdf';
        case "xbm":
        case "bmp":
        case "webp":
        case "svgz":
        case "jfif":
        case "ico":
        case "tiff":
        case "pjpeg":
        case "pjp":
        case "tif":
        case "gif":
        case "jpeg":
        case "jpg":
        case "png":
        case "svg":
            return 'img';
        default:
            return 'unKnown';
    }
}