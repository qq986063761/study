# 资源

- [MongoDB 官网](https://www.mongodb.com/)
- [下载 Community Server](https://www.mongodb.com/try/download/community)(https://mongodb.ac.cn/try/download/community)（本地学习用社区版即可）
- [windows快速下载](https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-8.3.2-signed.msi)
- [MongoDB 文档（中文可选）](https://www.mongodb.com/zh-cn/docs/)
- Shell 客户端：[mongosh](https://www.mongodb.com/try/download/shell)(https://mongodb.ac.cn/try/download/shell)（推荐，替代旧版 `mongo`）

# 理论

## 核心层级：Database → Collection → Document

MongoDB 的数据组织分为三层：

```
MongoDB 层级                    MySQL / 关系型数据库
──────────────────────────────────────────────────
Database（数据库）          ≈   Database（数据库）
  └── Collection（集合）    ≈   Table（表）
        └── Document（文档） ≈   Row（行）
              └── Field（字段/键值对） ≈ Column（列）
```

> **一句话记忆**：库 ≈ 库，集合 ≈ 表，文档 ≈ 行，字段 ≈ 列。区别在于 MongoDB 文档可以嵌套子文档和数组，不像关系型行的字段是扁平的。

### 1. Database（数据库）

- 一个 MongoDB 实例可承载多个数据库，每个数据库拥有独立的权限、集合、索引，彼此隔离。
- 命名规则：不能含 `/ \ . " * < > : | ? $` 空格和空字符；长度 ≤ 64 字节；推荐全小写英文。
- 保留库：
  - `admin`：存放用户、角色、分片集群管理等管理信息（`show dbs` 可能不显示，但有数据时会显示）。
  - `local`：存储副本集元数据、oplog（操作日志），**不会被复制**到其他节点。
  - `config`：分片集群的元数据（分片信息、chunk 分布等）。
- 创建与切换：`use 新库名` 只是切换上下文，要等首次写入数据（建集合或插入文档）后才真正创建。
- 删除：`db.dropDatabase()` 删除当前库及其中所有数据，不可恢复。

### 2. Collection（集合）

- 集合是一组文档的容器，**类比关系型数据库的表**。
- 同一个集合中的文档**不需要拥有相同的字段结构**——这正是 MongoDB 模式灵活的核心。
- 命名规则：不能以 `system.` 开头（系统保留），不能含 `$` 和空字符，通常用蛇形命名 `user_orders`。
- 隐式创建：直接 `db.集合名.insertOne({...})` 即可在写入时自动创建集合，无需预先定义。
- 显式创建：`db.createCollection("集合名", { ...选项 })` 可预设选项（如固定集合 capped、文档验证规则 validator 等）。
- 删除：`db.集合名.drop()` 删除集合及其所有文档和索引。
- 固定集合（Capped Collection）：固定大小、插入顺序的集合，达到上限后自动覆盖最旧文档，常用于日志队列。

### 3. Document（文档）

- 文档是 MongoDB 中**最基本的数据库单位**，**类比关系型数据库的行**。
- 内部存储格式为 **BSON**（Binary JSON），是一种二进制序列化格式。
- 文档由一组**键值对（Field : Value）**组成，键是字符串，值可以是各种类型（见下文）。
- 文档最大 16MB（BSON 限制）；如需更大，使用 GridFS 将大文件拆分成多个块存储。
- 文档的顶层结构是一个 BSON 对象 `{ }`。
- 示例：
  ```js
  {
    _id: ObjectId("647a1b2c3d4e5f6a7b8c9d0e"),
    name: "张三",
    age: 28,
    email: "zhangsan@example.com",
    tags: ["vip", "new_user"],
    address: {
      city: "北京",
      street: "长安街 100 号"
    }
  }
  ```

#### BSON 支持的数据类型

| 类型 | 说明 | 示例 |
|------|------|------|
| `Double` | 64 位浮点数（默认数字类型） | `age: 28` |
| `String` | UTF-8 字符串 | `name: "张三"` |
| `Object` | 嵌套文档（子文档） | `address: { city: "北京" }` |
| `Array` | 数组 | `tags: ["vip", "new"]` |
| `Binary data` | 二进制数据 | 文件内容、图片等 |
| `ObjectId` | 12 字节唯一标识 | `ObjectId("...")` |
| `Boolean` | 布尔值 | `isActive: true` |
| `Date` | UTC 日期时间（毫秒精度） | `createdAt: new Date()` 或 `ISODate("2025-01-01")` |
| `Null` | 空值 | `middleName: null` |
| `Int32` | 32 位整数 | `NumberInt(100)` |
| `Int64` / `Long` | 64 位整数 | `NumberLong("9007199254740992")` |
| `Decimal128` | 128 位高精度小数 | `NumberDecimal("9.99")`，适用于金额 |
| `Timestamp` | 内部时间戳（64 位） | 多用于 oplog |
| `RegExp` | 正则表达式 | `pattern: /^abc/i` |
| `MinKey` / `MaxKey` | 内部比较用极值 | 比任何值都小 / 大 |

> **注意**：JavaScript 的数字默认是 Double（64 位浮点数）。对金额等需要精确计算的场景，用 `NumberDecimal()`；对需要精确整数的场景，用 `NumberInt()` 或 `NumberLong()`。

### 4. 嵌套文档与数组（灵活模式的核心）

MongoDB 的文档可以嵌套子文档和数组，支持一对多、多对多关系的**嵌入（Embedding）**建模，避免像关系型数据库那样处处 JOIN。

```js
// 用户文档嵌入多个收货地址（一对多）
{
  _id: ObjectId("..."),
  name: "张三",
  addresses: [
    { type: "home", city: "北京", detail: "朝阳区某小区" },
    { type: "work", city: "上海", detail: "浦东新区某大厦" }
  ]
}
```

| 关系建模方式 | 说明 | 适用场景 |
|-------------|------|----------|
| **嵌入**（Embedding） | 将关联数据直接嵌套在文档中 | 数据紧密绑定、一次查询就需要全部返回（如用户 + 收货地址） |
| **引用**（Referencing） | 只存关联文档的 `_id`，需要时通过 `$lookup`（类似 JOIN）或多次查询获取 | 数据独立、频繁单独修改、或关联数据量巨大 |

### 5. `_id` 与 ObjectId

- 每个文档**必须**有一个 `_id` 字段，它是集合中**文档的唯一标识**（主键）。
- 不显式提供 `_id` 时，MongoDB 驱动程序会自动生成一个 **ObjectId**。
- **ObjectId** 是一个 12 字节的 BSON 类型：
  - 4 字节：时间戳（秒级，Unix epoch）
  - 5 字节：随机值（包括机器标识 + 进程标识）
  - 3 字节：自增计数器
- 由于时间戳在最前，ObjectId 天然**按生成时间大致有序**，这对索引和排序友好。
- 也可以自定义 `_id`：`db.coll.insertOne({ _id: "my-custom-id", name: "a" })`，类型不限（字符串、数字、甚至子文档），但必须唯一。
- `ObjectId("...")` 可调用 `.getTimestamp()` 获取生成时间。

### 6. 模式灵活性（Schemaless）

- MongoDB 不强制要求集合中所有文档拥有相同的字段结构。这和传统关系型数据库的**先定义表结构再写数据**完全不同。
- 这意味着：
  - ✅ 可以随时向新文档添加新字段，旧文档不受影响。
  - ✅ 开发初期快速迭代，字段随需求变化灵活调整。
  - ⚠️ 但在应用层仍需做好数据校验（MongoDB 支持 JSON Schema 验证：`validator`），避免「垃圾进垃圾出」。
- 3.6+ 版本支持 **JSON Schema** 约束，可在应用层之外再加一层数据库层的字段校验。

### 7. 与关系型数据库术语对照

| MySQL / PostgreSQL | MongoDB | 说明 |
|-------------------|---------|------|
| Database | Database | 数据库 |
| Table | Collection | 集合（表） |
| Row | Document | 文档（行） |
| Column | Field | 字段（列） |
| Primary Key | `_id` | 主键，自动生成的唯一标识 |
| JOIN | `$lookup` | 关联查询（聚合管道） |
| Index | Index | 索引 |
| Transaction | Transaction | 事务（4.0+ 支持多文档 ACID） |
| View | View | 视图 |

### 8. 索引（概述）

- 索引加速查询，避免全集合扫描（COLLSCAN）。
- 默认 `_id` 字段上已有唯一索引。
- 单字段索引：`db.coll.createIndex({ 字段: 1 })`（`1` 升序，`-1` 降序）。
- 复合索引：`db.coll.createIndex({ a: 1, b: -1 })` —— 字段顺序影响查询覆盖能力（ESR 规则：Equality → Sort → Range）。
- 默认索引类型为 B-tree（适用于大多数场景）；还支持地理空间（2dsphere）、文本（text）、哈希（hashed）等特殊索引。
- 进阶：查看执行计划用 `explain("executionStats")`，分析慢查询。

### 9. 副本集与分片（进阶概念）

- **副本集**（Replica Set）：多节点保存相同数据副本，主节点（Primary）负责写入，从节点（Secondary）异步同步并可用于只读查询。自动故障转移。生产环境最低配置为 3 节点（或 2 节点 + 仲裁节点 arbiter）。
- **分片**（Sharding）：将数据水平拆分到多个分片服务器上，每个分片只存一部分数据（通过 shard key 决定）。用于处理超大规模数据和超高吞吐量。
- **事务**：4.0 版本引入多文档事务（Replica Set），4.2 引入分布式事务（Sharded Cluster），支持 ACID。但应优先用文档嵌入设计来避免多文档事务，仅在确实需要时使用。

# 安装（Community）

## Windows

1. 官网下载 **Windows** 安装包（MSI）或 ZIP；MSI 可按向导勾选 **Install MongoDB as a Service**（装成 Windows 服务）。
2. 默认数据目录常见为 `C:\Program Files\MongoDB\Server\<版本>\data` 或安装时自定义；配置文件多为 `mongod.cfg`（YAML）。
3. 将 `mongod.exe`、`mongosh.exe` 所在 `bin` 目录加入系统 **PATH**，便于命令行直接使用。
4. 若未装服务，可手动启动（示例，路径按本机调整）：
   - `mongod --dbpath "D:\data\db"`（先建好空目录）
5. 另装 **mongosh**：可与数据库分开下载，用于连接本机或远程实例。

## macOS

1. **Homebrew 安装（推荐）**：
   - `brew tap mongodb/brew`
   - `brew install mongodb-community@8.0`（版本号按实际选择）
   - 安装后 Homebrew 会自动创建数据目录 `/usr/local/var/mongodb`（Intel）或 `/opt/homebrew/var/mongodb`（Apple Silicon）和配置文件 `/usr/local/etc/mongod.conf`（Intel）或 `/opt/homebrew/etc/mongod.conf`（Apple Silicon）。
2. **服务管理**（brew services）：
   - 启动：`brew services start mongodb-community@8.0`
   - 停止：`brew services stop mongodb-community@8.0`
   - 重启：`brew services restart mongodb-community@8.0`
3. **手动启动**（若不用 brew services）：
   - `mongod --config /usr/local/etc/mongod.conf --fork`（`--fork` 后台运行，需配合 `--logpath` 指定日志路径）
4. **另装 mongosh**：
   - `brew install mongosh`
   - 或从 [mongosh 下载页](https://www.mongodb.com/try/download/shell) 手动下载解压，将 `bin` 加入 PATH。
5. **手动下载方式**（不用 Homebrew）：
   - 官网下载 `.tgz` 压缩包 → 解压 → 将 `bin` 目录加入 PATH → 手动创建数据目录并启动 `mongod --dbpath <数据目录>`。

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
