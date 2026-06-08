# 资源
- [官网下载](https://dev.mysql.com/downloads/mysql/)
- 当前稳定版：**MySQL 8.4 LTS**（推荐生产环境使用）；最新创新版：**MySQL 9.x**（尝鲜体验）

---

# 理论

---

# 安装

## Windows

### 1. 下载
从[官网](https://dev.mysql.com/downloads/mysql/)下载 ZIP Archive 压缩包（选择 Windows (x86, 64-bit), ZIP Archive）。

> 如果官网下载慢，也可以从国内镜像站（如清华镜像、阿里镜像）下载。

### 2. 解压
将压缩包解压到目标目录，例如 `D:\mysql`（路径中不要有中文和空格）。

### 3. 配置环境变量
将 `bin` 目录路径（如 `D:\mysql\bin`）添加到系统环境变量 `Path` 中。

### 4. 创建配置文件
在安装目录下新建 `my.ini`，内容如下：

```ini
[mysqld]
# 设置安装目录
basedir=D:/mysql
# 设置数据目录
datadir=D:/mysql/data
# 默认端口
port=3306
# 字符集
character-set-server=utf8mb4
# 身份验证插件（8.x 默认 caching_sha2_password，如需兼容旧客户端可改为 mysql_native_password）
default_authentication_plugin=mysql_native_password

[mysql]
default-character-set=utf8mb4

[client]
port=3306
default-character-set=utf8mb4
```

> **注意**：路径分隔符使用 `/` 而非 `\`，`basedir` 和 `datadir` 请替换为你的实际路径。

### 5. 创建 data 目录
在安装目录下手动创建一个空的 `data` 文件夹。

### 6. 初始化数据库
以**管理员身份**打开终端，执行：

```shell
mysqld --initialize --console
```

执行后会打印初始随机密码，例如：
```
[Note] A temporary password is generated for root@localhost: z<5aO,Wgb>&t
```

**请务必记录这个密码**，后续首次登录需要用到。

> 如果忘记了密码，或者初始化失败：先删除 `data` 目录，再重新执行初始化命令。

### 7. 安装 Windows 服务

```shell
# 安装服务（在管理员终端中执行）
mysqld --install MySQL

# 如果之前安装过旧服务，先移除
mysqld --remove MySQL
```

### 8. 启动服务

```shell
net start mysql
```

---

## macOS

### 方式一：Homebrew 安装（推荐）

```shell
# 安装 MySQL
brew install mysql

# 启动服务
brew services start mysql

# 安全初始化（设置密码等）
mysql_secure_installation
```

Homebrew 安装后默认数据目录为 `/opt/homebrew/var/mysql`（Apple Silicon）或 `/usr/local/var/mysql`（Intel Mac）。

### 方式二：官方 DMG 安装
1. 从[官网](https://dev.mysql.com/downloads/mysql/)下载 macOS DMG 安装包（根据芯片选择 ARM 或 x86）。
2. 双击 `.dmg` 文件，按向导完成安装。
3. 安装完成后会弹出初始密码提示框，**务必记录**。
4. 在「系统偏好设置 / 系统设置」中会出现 MySQL 图标，可在此启停服务。

### 常用命令（macOS）

```shell
# 启动 / 停止 / 重启（Homebrew）
brew services start mysql
brew services stop mysql
brew services restart mysql

# 查看服务状态
brew services list

# 登录
mysql -uroot -p
```

---

# 命令

## 服务管理
| 命令 | 说明 |
|------|------|
| `net start mysql` | Windows 启动服务 |
| `net stop mysql` | Windows 关闭服务 |
| `brew services start mysql` | macOS 启动服务 |
| `brew services stop mysql` | macOS 关闭服务 |

## 账号
| 命令 | 说明 |
|------|------|
| `mysql -uroot -p` | 登录 MySQL |
| `ALTER USER 'root'@'localhost' IDENTIFIED BY '123456';` | 修改密码（使用默认认证插件） |
| `ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '123456';` | 修改密码（指定认证插件，兼容旧客户端） |
| `exit` / `quit` / `\q` | 退出 MySQL |

## 配置
| 命令 | 说明 |
|------|------|
| `SHOW GLOBAL VARIABLES LIKE 'port';` | 查看端口号 |

## 数据库
| 命令 | 说明 |
|------|------|
| `SHOW DATABASES;` | 查看所有数据库 |
| `CREATE DATABASE db_name;` | 创建数据库 |
| `USE db_name;` | 使用数据库 |
| `DROP DATABASE db_name;` | 删除数据库 |

## 数据表
| 命令 | 说明 |
|------|------|
| `SHOW TABLES;` | 查看当前数据库下所有表 |
| `DESC table_name;` | 查看表结构 |
| `CREATE TABLE table_name (col col_type(size), ...);` | 创建表 |
| `DROP TABLE table_name;` | 删除表 |
| `ALTER TABLE table_name RENAME TO new_name;` | 修改表名 |
| `ALTER TABLE table_name ADD field type(size);` | 新增字段 |
| `ALTER TABLE table_name DROP field;` | 删除字段 |
| `ALTER TABLE table_name MODIFY field type(size);` | 修改字段类型 |
| `ALTER TABLE table_name CHANGE field new_field type(size);` | 修改字段名和类型 |

## 数据操作
| 命令 | 说明 |
|------|------|
| `INSERT INTO table (field, ...) VALUES (val, ...);` | 插入数据 |
| `DELETE FROM table [WHERE ...];` | 删除数据 |
| `UPDATE table SET field=val, ... [WHERE ...];` | 更新数据 |
| `SELECT field, ... FROM table [WHERE ...] [ORDER BY field [ASC\|DESC]];` | 查询数据 |

## 连接查询
```sql
SELECT a.field, b.field
FROM table1 a
[LEFT | INNER | RIGHT] JOIN table2 b
ON a.field = b.field;
```

WHERE 子句支持：`=`、`>`、`<`、`>=`、`<=`、`LIKE`、`IS NULL`、`IS NOT NULL`，用 `AND` / `OR` 组合。

---

# 常见问题

## 执行 bin 下文件时提示找不到 VCRUNTIME140.dll
- **原因**：缺少 Visual C++ 运行库
- **解决**：下载安装 [Visual C++ Redistributable](https://www.microsoft.com/zh-CN/download/details.aspx?id=48145)

## Navicat 等客户端登录报错 `authentication plugin caching_sha2_password...`
- **原因**：MySQL 8.0+ 默认认证插件从 `mysql_native_password` 改为 `caching_sha2_password`，旧版客户端不兼容
- **解决**：修改密码时指定旧认证方式：
  ```sql
  ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '你的密码';
  ```

## macOS Homebrew 安装后无法启动
- 检查是否已有 MySQL 进程：`ps aux | grep mysql`
- 查看错误日志：`tail -f /opt/homebrew/var/mysql/*.err`（Apple Silicon）或 `/usr/local/var/mysql/*.err`（Intel）
- 尝试重新初始化：先 `brew services stop mysql`，再 `mysqld --initialize --datadir=/opt/homebrew/var/mysql`
