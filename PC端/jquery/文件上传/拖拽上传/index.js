var $file = $('#upload');
var $dragBox = $('#dragContainer');
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

//非拖拽文件上传,监听文件选择
$file.on('change', function (e) {
	// 获取文件
	var files = this.files;
	for (var i = 0, file; file = files[i]; i++) {
		// 获取文件信息
		var fileName = file.name;
		var fileSize = file.size;
		var fileType = getFileType(fileName);
		// 获取当前时间
		var createDate = new Date('yyyy-MM-dd');

		//获取尺寸字符串
		var size = getSizeStrByBit(fileSize);
		var imgSrc = getImgSrcByFileType(fileType);
		if (imgSrc == 'img') {
			imgSrc = window.URL.createObjectURL(file);
		}

		// 封装fromData
		var formData = new FormData();
		formData.append('file', file);

		// 发送请求
		$.ajax({
			url: 'http://localhost:8000/',
			type: 'post',
			dataType: 'text',
			// 发送文件必写
			processData: false,
			// 发送文件必写
			contentType: false,
			timeout: 3000,
			data: formData,
			success: function (res) {
				var html = '<div class="item"><div><img src="' + imgSrc + '"/></div>'
					+ '<div><div class="name">' + fileName + '</div><div class="size">' + size + '</div></div></div>';

				$container.append(html);
			},
			error: function () {
				console.error("请求出错");
			},
			complete: function () {
				$file.val('');
			}
		});
	}
});

//文件拖拽到区域内部的时候触发
$dragBox[0].ondragenter = function (e) {
	e.preventDefault();
	$(this).css('background-color', 'lightgray');
};

//文件拖拽到指定区域内部移动的时候触发
$dragBox[0].ondragover = function (e) {
	e.preventDefault();
	$(this).css('background-color', 'lightgray');
};

//文件移出指定区域内部的时候触发
$dragBox[0].ondragleave = function (e) {
	e.preventDefault();
	$(this).css('background-color', '#FFF');
};

// 当文件在指定区域内被放下的时候触发
$dragBox[0].ondrop = function (e) {
	e.preventDefault();
	e.stopPropagation();

	$(this).css('background-color', '#FFF');

	// 获取拖拽的文件
	var fileList = e.dataTransfer.files;

	//遍历获取的文件列表
	for (var i = 0; i < fileList.length; i++) {
		var file = fileList[i];
		// 获取文件信息
		var fileName = file.name;
		var fileSize = file.size;
		var fileType = getFileType(fileName);
		// 获取当前时间
		var createDate = new Date('yyyy-MM-dd');

		//获取尺寸字符串
		var size = getSizeStrByBit(fileSize);
		var imgSrc = getImgSrcByFileType(fileType);
		if (imgSrc == 'img') {
			imgSrc = window.URL.createObjectURL(file);
		}

		// 封装fromData
		var formData = new FormData();
		formData.append('file', file);

		// 发送请求
		$.ajax({
			url: 'http://localhost:8000/',
			type: 'post',
			dataType: 'text',
			// 发送文件必写
			processData: false,
			// 发送文件必写
			contentType: false,
			timeout: 3000,
			data: formData,
			success: function (res) {
				var html = '<div class="item"><div><img src="' + imgSrc + '"/></div>'
					+ '<p class="name">' + fileName + '</p><p class="size">' + size + '</p></div>';

				$container.append(html);
			},
			error: function () {
				console.error("请求出错");
			},
			complete: function () {
				$file.val('');
			}
		});
	}
};

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