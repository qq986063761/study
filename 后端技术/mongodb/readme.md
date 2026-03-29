# 资源

- [MongoDB 官网](https://www.mongodb.com/)
- [下载 Community Server](https://www.mongodb.com/try/download/community)（本地学习用社区版即可）
- [MongoDB 文档（中文可选）](https://www.mongodb.com/zh-cn/docs/)
- Shell 客户端：[mongosh](https://www.mongodb.com/docs/mongodb-shell/)（推荐，替代旧版 `mongo`）

# 理论（速览）

- **文档数据库**：数据以 BSON（类 JSON 二进制）文档为单位存储，集合（collection）≈ 表，文档 ≈ 行，字段可嵌套、数组，模式灵活。
- **与关系型差异**：无固定表结构强约束；用 `_id` 唯一标识文档（可自生成 ObjectId）；关联多用嵌入文档或 `$lookup`，不必处处建外键。
- **常用概念**：database → collection → document；索引加速查询；副本集/分片属进阶运维与扩展话题。

# 安装（Community / Windows）

1. 官网下载 **Windows** 安装包（MSI）或 ZIP；MSI 可按向导勾选 **Install MongoDB as a Service**（装成 Windows 服务）。
2. 默认数据目录常见为 `C:\Program Files\MongoDB\Server\<版本>\data` 或安装时自定义；配置文件多为 `mongod.cfg`（YAML）。
3. 将 `mongod.exe`、`mongosh.exe` 所在 `bin` 目录加入系统 **PATH**，便于命令行直接使用。
4. 若未装服务，可手动启动（示例，路径按本机调整）：
   - `mongod --dbpath "D:\data\db"`（先建好空目录）
5. 另装 **mongosh**：可与数据库分开下载，用于连接本机或远程实例。

# 命令

## 服务（Windows）

- `net start MongoDB`：启动服务（服务名以「服务」管理器中实际名称为准，常见为 `MongoDB`）
- `net stop MongoDB`：停止服务

## 连接与帮助

- `mongosh`：默认连接本机 `mongodb://127.0.0.1:27017`
- `mongosh "mongodb://用户名:密码@主机:端口/数据库名"`：带认证连接
- `help`：帮助；`db.help()`、`db.collection.help()`：数据库/集合相关帮助

## 数据库

- `show dbs`：列出数据库（有数据才显示体积）
- `use 数据库名`：切换数据库（不存在则会在首次写入时创建）
- `db`：当前使用的数据库名
- `db.dropDatabase()`：删除当前数据库（先 `use` 到目标库）

## 集合

- `show collections`：当前库下的集合
- `db.createCollection("集合名")`：显式创建（通常直接 `insert` 也会隐式创建）
- `db.集合名.drop()`：删除集合

## 插入（Create）

- `db.集合名.insertOne({ name: "a", age: 1 })`：插入一条
- `db.集合名.insertMany([ { }, { } ])`：插入多条

## 查询（Read）

- `db.集合名.find()`：查全部（可加 `.pretty()` 格式化）
- `db.集合名.findOne({ 条件 })`：查一条
- `db.集合名.find({ age: { $gte: 18 } })`：条件查询（`$gt` `$lt` `$in` 等）
- `db.集合名.find({}, { name: 1, _id: 0 })`：投影（只返回部分字段）
- `db.集合名.find().sort({ age: -1 }).limit(10)`：排序与限制条数
- `db.集合名.countDocuments({ })`：条件计数

## 更新（Update）

- `db.集合名.updateOne({ 条件 }, { $set: { age: 20 } })`
- `db.集合名.updateMany({ 条件 }, { $set: { flag: true } })`
- `db.集合名.replaceOne({ 条件 }, { 全新文档 })`：整文档替换（注意 `_id`）

## 删除（Delete）

- `db.集合名.deleteOne({ 条件 })`
- `db.集合名.deleteMany({ 条件 })`

## 索引（入门）

- `db.集合名.createIndex({ 字段: 1 })`：升序索引（`-1` 为降序）
- `db.集合名.getIndexes()`：查看索引
- `db.集合名.dropIndex("索引名")`：删除索引

## 其他常用

- `exit` 或 `quit`：退出 mongosh

# 学习顺序建议

1. 装好 **mongod** + **mongosh**，能 `show dbs`、建库建集合。
2. 熟练 **CRUD**：`insertOne` / `find` / `update` / `delete`，配合查询运算符 `$gt`、`$in`、`$regex` 等。
3. 理解 **`_id` 与 ObjectId**，再学 **索引** 与简单 **聚合** `aggregate`（管道）。
4. 需要时再学：副本集、分片、事务、与编程语言的官方驱动（Node/Java 等）。
