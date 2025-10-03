# 初始化系统跳过联网
Shift+F10 调出【命令提示符窗口】
输入 OOBE\BYPASSNRO 回车

# 关通知
系统-通知-关闭
隐私和安全性
	常规-通知全关闭
	诊断和反馈-反馈频率-从不

# 关更新
windows更新
	高级选项-传递优化-关闭
win+r gpedit.msc 打开策略
	计算机配置-管理模板-windows组件-windows更新
		管理最终用户体验-配置自动更新-禁用
		管理 windows server update service 提供的更新-自动更新检测频率-禁用
		旧策略-不要在“关闭windows”对话框显示“安装更新并关闭”-启用
开始-搜索-注册表编辑器
	计算机\HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\WindowsUpdate\UX\Settings
		新建 DWORD（32位）值 FlightSettingsMaxPauseDays 设置 10进制 36500 100年；重启后选择暂停更新100年
win+r services.msc 打开服务
	windows更新服务（wuauserv）禁用、停止
	
# 改存储位置
系统-存储-高级存储设置-保存新内容的地方
资源管理器-左边桌面、下载等文件夹-改到其他盘

# 卸载初始化软件
卸载大内存非必要软件

# 电池
系统-电源和电池
	电源模式-已接通电源-最佳性能
	屏幕、睡眠和休眠超时-已接通电源-从不
	盖子、电源和睡眠 按钮控件-已接通电源-按电源按钮-改成关机，其他保持睡眠

# 虚拟内存
系统-系统信息-高级系统设置-性能设置-高级-C盘-设置系统内存（32G）的1.5（49152）-2倍（65536）MB值

# 下恶意软件删除工具
如果 win+r mrt 不存在，就手动下载 https://www.microsoft.com/zh-CN/download/details.aspx?id=9905

# windows 安全中心不是中文
- Microsoft Store 

# 软件下载
压缩软件 7zip 360压缩
谷歌浏览器


