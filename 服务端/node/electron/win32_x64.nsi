OutFile "app_win32_x64.exe" #输出安装包名
ShowInstDetails show #显示安装详细信息
ShowUnInstDetails show #显示卸载详细信息

!define PRJNAME "app"
!define DEFAULTOUTPUT "$EXEDIR"
!define PACKAGEDIR "D:\workspace\electron\dist\app"
!define ICONDIR "C:\Users\WanPeng\Downloads\electron-v2.0.1-win32-x64"

Icon "${ICONDIR}\icon.ico" # 安装包图标
UninstallIcon "${ICONDIR}\icon.ico" # 卸载exe图标

# 自定义目录

Var INI

Page Custom ShowCustom LeaveCustom

Function .onInit

BringToFront
	InitPluginsDir
	GetTempFileName $INI $PLUGINSDIR
	File /oname=$INI "execonfig.ini"

WriteINIStr $INI "Field 2" "State" ${DEFAULTOUTPUT} # 初始化写入路径
ReadINIStr $R2 $INI "Field 2" "State" # 初始化读路径

FunctionEnd

Function ShowCustom
	InstallOptions::initDialog /NOUNLOAD "$INI"
	InstallOptions::show
FunctionEnd

Function LeaveCustom
	ReadINIStr $R2 $INI "Field 2" "State"
FunctionEnd

Page instfiles


# 主程序

Section "install"

	DetailPrint "安装中..."

	SetOutPath "$R2\${PRJNAME}"
	File "${PACKAGEDIR}\*"

	SetOutPath "$R2\${PRJNAME}\locales"
	File "${PACKAGEDIR}\locales\*"

	SetOutPath "$R2\${PRJNAME}\resources"
	File "${PACKAGEDIR}\resources\*"

	SetAutoClose true # 自动关闭安装程序

SectionEnd


Section WriteUninstaller
  WriteUninstaller "$R2\${PRJNAME}\Uninstall_${PRJNAME}.exe" # 放置卸载程序
SectionEnd

Function un.onUninstSuccess
  HideWindow
  MessageBox MB_ICONINFORMATION|MB_OK "卸载成功！"
FunctionEnd

Function un.onInit
  MessageBox MB_ICONQUESTION|MB_YESNO|MB_DEFBUTTON2 "你确定要卸载？" IDYES +2
  Abort
FunctionEnd



Section Uninstall

	delete "$INSTDIR\Uninstall_${PRJNAME}.exe"
	delete "$INSTDIR\locales\*"
	delete "$INSTDIR\resources\*"
	delete "$INSTDIR\*"

	SetAutoClose true

SectionEnd

