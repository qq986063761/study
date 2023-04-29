OutFile "app_win32_x64.exe" #�����װ����
ShowInstDetails show #��ʾ��װ��ϸ��Ϣ
ShowUnInstDetails show #��ʾж����ϸ��Ϣ

!define PRJNAME "app"
!define DEFAULTOUTPUT "$EXEDIR"
!define PACKAGEDIR "D:\workspace\electron\dist\app"
!define ICONDIR "C:\Users\WanPeng\Downloads\electron-v2.0.1-win32-x64"

Icon "${ICONDIR}\icon.ico" # ��װ��ͼ��
UninstallIcon "${ICONDIR}\icon.ico" # ж��exeͼ��

# �Զ���Ŀ¼

Var INI

Page Custom ShowCustom LeaveCustom

Function .onInit

BringToFront
	InitPluginsDir
	GetTempFileName $INI $PLUGINSDIR
	File /oname=$INI "execonfig.ini"

WriteINIStr $INI "Field 2" "State" ${DEFAULTOUTPUT} # ��ʼ��д��·��
ReadINIStr $R2 $INI "Field 2" "State" # ��ʼ����·��

FunctionEnd

Function ShowCustom
	InstallOptions::initDialog /NOUNLOAD "$INI"
	InstallOptions::show
FunctionEnd

Function LeaveCustom
	ReadINIStr $R2 $INI "Field 2" "State"
FunctionEnd

Page instfiles


# ������

Section "install"

	DetailPrint "��װ��..."

	SetOutPath "$R2\${PRJNAME}"
	File "${PACKAGEDIR}\*"

	SetOutPath "$R2\${PRJNAME}\locales"
	File "${PACKAGEDIR}\locales\*"

	SetOutPath "$R2\${PRJNAME}\resources"
	File "${PACKAGEDIR}\resources\*"

	SetAutoClose true # �Զ��رհ�װ����

SectionEnd


Section WriteUninstaller
  WriteUninstaller "$R2\${PRJNAME}\Uninstall_${PRJNAME}.exe" # ����ж�س���
SectionEnd

Function un.onUninstSuccess
  HideWindow
  MessageBox MB_ICONINFORMATION|MB_OK "ж�سɹ���"
FunctionEnd

Function un.onInit
  MessageBox MB_ICONQUESTION|MB_YESNO|MB_DEFBUTTON2 "��ȷ��Ҫж�أ�" IDYES +2
  Abort
FunctionEnd



Section Uninstall

	delete "$INSTDIR\Uninstall_${PRJNAME}.exe"
	delete "$INSTDIR\locales\*"
	delete "$INSTDIR\resources\*"
	delete "$INSTDIR\*"

	SetAutoClose true

SectionEnd

