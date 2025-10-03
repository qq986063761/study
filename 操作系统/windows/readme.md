# powersheel 无法加载脚本文件
报错比如：
live-server : 无法加载文件 d:\Program Files\nodejs\live-server.ps1，因为在此系统上禁止运行脚本。有关详细信息，请参阅 https:/go.microsoft.com/fwlin
k/?LinkID=135170 中的 about_Execution_Policies。
所在位置 行:1 字符: 1
+ live-server
+ ~~~~~~~~~~~
    + CategoryInfo          : SecurityError: (:) []，PSSecurityException
    + FullyQualifiedErrorId : UnauthorizedAccess
解决：
以管理员身份运行PowerShell
执行 Set-ExecutionPolicy RemoteSigned，选 y 或者 a