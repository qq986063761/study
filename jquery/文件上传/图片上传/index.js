var $file = $('#upload');
var $container = $('#container');

// 监听文件选择
$file.on('change', function (e) {
	// 获取文件
	var files = this.files;
	// 遍历文件
	for (var i = 0, file; file = files[i]; i++) {
		// 获取文件属性
		var fileName = file.name;
		var fileType = getFileType(fileName);

		// 校验
		if (fileType !== 'img') {
			console.warn('请上传图片');
			return;
		}

		// 获取图片资源
		var imgSrc = window.URL.createObjectURL(file);

		// 封装 formData 数据用于发送文件
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
			success: function (res) {
				//追加文件项目到文件容器中
				var html = '<div class="item" title="' + fileName + '">'
					+ '<img src="' + imgSrc + '">'
					+ '</div>';

				$container.append(html);
			},
			error: function () {
				console.error("发送图片请求出错");
			},
			complete: function () {
				$file.val('');
			}
		});
	}
});

// 获取文件类型
function getFileType(fileName) {
	var extName = fileName && fileName.substr(fileName.lastIndexOf(".") + 1) || '';
	extName = extName.toLowerCase();

	switch (extName) {
		case "txt":
			return 'txt';
		case "rar":
		case "zip":
			return 'zip';
		case "doc":
		case "docx":
		case "dot":
		case "wps":
		case "wpt":
		case "dotx":
		case "docm":
		case "dotm":
			return 'doc';
		case "ppt":
		case "pptx":
		case "pot":
		case "potx":
		case "pps":
		case "ppsx":
		case "dps":
		case "dpt":
		case "pptm":
		case "potm":
		case "ppsm":
			return 'ppt';
		case "xls":
		case "xlsx":
		case "csv":
		case "xlt":
		case "et":
		case "ett":
		case "xltx":
		case "xlsb":
		case "xlsm":
		case "xltm":
		case "ets":
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
			return 'other';
	}
}