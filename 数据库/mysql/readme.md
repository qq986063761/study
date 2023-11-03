# 资源

- [官网下载](https://dev.mysql.com/downloads/mysql/)

# 理论

# 安装（8.x）

# windows

- 下载压缩包（压缩包在我百度云有），解压后配置环境 path 变量：D:\mysql-8.0.13-winx64\bin
- 寻找 my.ini 文件到安装目录下（默认没有 my.ini，可取老版本的解压文件中的默认文件，我百度云存了一份）
- 安装目录下创建 data 文件夹
- 管理员权限下的终端执行：mysqld --initialize --console 初始化数据库（有可能什么反应都没有，可在bin目录下执行对应命令文件看报错），并记录初始密码（例：root@localhost: z<5aO,Wgb>&t），如果密码忘记，则删除 data 目录下的数据，然后再次重新初始化
- 管理员权限下的终端：1、先 cd 到安装目录下的 bin 目录；2、执行：mysqld.exe -install（如果之前存在此服务可执行：mysqld -remove MySQL 先移除服务）；

# 命令

# 服务

- net start mysql：启动服务
- net stop mysql：关闭服务

# 账号

- 登录 mysql：mysql -uroot -p
- 修改密码：ALTER USER "root"@"localhost" IDENTIFIED WITH mysql_native_password BY "123456";
- 退出 mysql：exit（或者 quit、\q）

# 配置

- show global variables like 'port';：查看数据库端口号配置

# 数据库

- show databases;：查看所有数据库
- create database DB_NAME;：创建数据库
- use DB_NAME;：使用数据库
- drop database DB_NAME;：删除数据库

# 数据表

- show tables;：查看当前数据库下的所有表
- create table TABLE_NAME (COL_NAME COL_TYPE(SIZE), ...);：创建表（字段名和字段类型）
- drop table TABLE_NAME;：删除表
- alter table TABLE_NAME rename to NEW_TABLE_NAME;：修改表名
- desc TABLE_NAME;：查看表结构
- alter table TABLE_NAME add FIELD_NAME FIELD_TYPE(SIZE);：新增表字段
- alter table TABLE_NAME drop FIELD_NAME;：删除表字段
- alter table TABLE_NAME modify FIELD_NAME FIELD_TYPE(SIZE) [not null];：修改表字段类型
- alter table TABLE_NAME change FIELD_NAME NEW_FIELD_NAME FIELD_TYPE(SIZE);：修改表字段名和类型
- insert into TABLE_NAME (FIELD_NAME, ...) values (VALUE, ...);：插入数据到表中
- delete from TABLE_NAME [where OPTIONS [and、or] OPTIONS];：删除表数据【筛选条件】
- update TABLE_NAME set FIELD_NAME=VALUE, ... [where OPTIONS [and、or] OPTIONS];：更新表数据【筛选条件】
- select FIELD_NAME, ... from TABLE_NAME, ... ：查询表数据
  - [where OPTIONS [like、is null、is not null] [and、or] OPTIONS];：条件查询
  - [order by age [asc、desc]];：排序查询
- select ALIAS_NAME1.FIELD_NAME, ALIAS_NAME2.FIELD_NAME from TABLE1_NAME ALIAS_NAME1 [left、inner、right] join TABLE2_NAME ALIAS_NAME2 on ALIAS_NAME1.FIELD_NAME=ALIAS_NAME2.FIELD_NAME;：连接查询表数据

# bug

# 执行 bin 下的文件时，找不到 VCRUNTIME140.dll
- [下载地址](https://www.microsoft.com/zh-CN/download/details.aspx?id=48145)

# 客户端工具 navicat 登录报错 authentication plugin caching_sha2_pa......

- 因为 8.x 版本后身份验证方式改变，可在修改密码时带上可选项 WITH mysql_native_password
