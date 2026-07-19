var $file = $('#upload');
var $container = $('#container');

Date.prototype.format = Date.prototype.format || function ( fmt ) {		
	var o = {
		"M+" : this.getMonth()+1,                 //月份
		"d+" : this.getDate(),                    //日
		"h+" : this.getHours(),                   //小时
		"m+" : this.getMinutes(),                 //分
		"s+" : this.getSeconds(),                 //秒
		"q+" : Math.floor((this.getMonth()+3)/3), //季度
		"S"  : this.getMilliseconds()             //毫秒
	};
	
	if(/(y+)/.test(fmt))
		fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
		
	for(var k in o)
		if(new RegExp("("+ k +")").test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
			
	return fmt;
};

//监听文件选择
$file.on('change', function (e) {
	// 获取文件
    var files = this.files;
    // 遍历选中文件
    for (var i = 0, file; file = files[i]; i++) {
        //获取尺寸字符串
        var size = getSizeStrByBit(file.size);

        //获取文件扩展名的类型,用于获取对应文档图标
        var fileName = file.name;
        var fileType = getFileType(fileName);
        // 获取展示图片资源
        var imgSrc = getImgSrcByFileType(fileType);       
        if(imgSrc === 'img'){
            imgSrc = window.URL.createObjectURL(file);
        }

        //获取当前时间字符串
        var createDate = new Date().format('yyyy-MM-dd');

        //追加文件项目到文件容器中
        var html = '<div class="item"><div class="left">'
        	+ '<img class="img" src="'+ imgSrc +'"/><div>'
        	+ '<div class="name" title="' + fileName + '">'
        	+ (fileName.length > 11 ? fileName.substr(0, 10) + "..." : fileName) + '</div>'
        	+ '<div class="size">' + size + '</div>'
        	+ '</div></div><div class="right"><div class="date">'+ createDate +'</div>'
        	+ '<div class="from">来自某人</div></div><div class="center">'
        	+ '<div><a href="javascript:;" class="download">下载</a><a href="javascript:;" class="del">删除</a><div class="percent"></div></div>'
			+ '</div></div></div>';
        
        $container.append(html);
        
        // 删除事件绑定
        var $tmpFile = $container.find('.item:last-child');
		$tmpFile.find('.del').click(function (e) {
			$(this).closest('.item').remove();
		});

        // 封装formdata
        var formData = new FormData();
        formData.append('file', file);
        
		// 发送请求
		$.ajax({
	        url: 'http://localhost:8000/',
	        type: 'post',
	        data: formData,
	        dataType: 'text',
	        // 发送文件必写
	        processData: false, 
	        // 发送文件必写
	        contentType: false, 
	        timeout: 3000,
//	        xhr: function () {
//              var xhr = $.ajaxSettings.xhr();
//              
//              xhr.upload.onload = function () {  
//                  console.info('上传完成')
//              }
//              
//              xhr.upload.onprogress = function (ev) {
//                  if(ev.lengthComputable) {
//                      var percent = 100 * ev.loaded / ev.total;
//                      $tmpFile.find('.percent').text( percent );
//                  }
//              }
//              
//              return xhr;  
//          },
            success: function (res) {
				console.log('发送成功');
            },
            error: function (err) {
                console.error('请求出错');
            },
            complete:function(){
                $file.val('');
            }
	   	});
    }
});

// 获取缩略图路径
function getImgSrcByFileType (fileType) {
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
function getSizeStrByBit (fileSize) {
    return (fileSize > 1024 * 1024) ? (Math.round(fileSize / 1024 / 1024 * 100) / 100 + "M") : ((fileSize > 1024) ? (Math.round(fileSize / 1024 * 100) / 100 + "KB") : (fileSize + "B"));
}

// 获取文件类型
function getFileType (fileName) {
    var extName = fileName && fileName.substr(fileName.lastIndexOf(".") + 1) || '';
    extName = extName.toLowerCase()
    switch(extName){
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
            return '';
    }
}