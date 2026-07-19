# 资源
- [官网下载](https://dev.mysql.com/downloads/mysql/)
- 当前稳定版：**MySQL 8.4 LTS**（推荐生产环境使用）；最新创新版：**MySQL 9.x**（尝鲜体验）

---

# 理论

## 核心层级：Database → Table → Row → Column

MySQL 的数据组织分为四层，是典型关系型数据库的层级结构：

```
MySQL 层级
────────────────────
Database（数据库）
  └── Table（表）
        └── Row（行）
              └── Column（列/字段）
```

| MySQL 层级 | 说明 | MongoDB 对应 | 类比 |
|-----------|------|-------------|------|
| **Database**（数据库） | 一个 MySQL 实例下可有多个数据库，各库独立管理、独立权限。 | Database | Excel 文件 |
| **Table**（表） | 数据库中的二维表，**先定义结构（Schema）再写数据**。 | Collection | 工作表（Sheet） |
| **Row**（行） | 表中的一条完整记录，同一表中所有行的列结构相同。 | Document | 工作表中的一行 |
| **Column**（列/字段） | 表结构的一部分，定义字段名、数据类型、约束。所有行列结构一致，**扁平不可嵌套**。 | Field | 工作表中的一列 |

> **核心差异**：MySQL 必须先 `CREATE TABLE` 定义好所有列和类型，再插入行；行结构扁平，不能像 MongoDB 文档那样嵌套子对象或数组。

---

## 1. Database（数据库）

- MySQL 实例可创建多个数据库，各库拥有独立的表、视图、存储过程、函数。
- 命名规则：长度 ≤ 64 字节，由字母、数字、下划线组成，推荐全小写加下划线（如 `my_shop`）。
- 系统库（不要随意操作）：
  - `mysql`：存储用户、权限、时区等系统元数据。
  - `information_schema`：只读的系统信息库，如表结构、索引信息等。
  - `performance_schema`：性能监控数据，用于分析慢查询、锁等待等。
  - `sys`：基于上面两库的易读视图集合，简化性能诊断。
- 创建：`CREATE DATABASE db_name CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
- 删除：`DROP DATABASE db_name;`（不可恢复）

---

## 2. Table（表）

- 表是 MySQL 中存放数据的容器，**必须先定义结构（Schema）再写入数据**。
- 创建表时需要指定每一列的名称、数据类型及可选约束：
  ```sql
  CREATE TABLE user (
    id       INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name     VARCHAR(50)  NOT NULL,
    age      TINYINT UNSIGNED DEFAULT 0,
    email    VARCHAR(100) UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  ```
- 命名规则：通常用蛇形命名 `user_order`，避免关键字冲突。
- **临时表**：`CREATE TEMPORARY TABLE ...`，会话结束时自动删除，适用于中间计算结果暂存。
- **视图（View）**：基于查询语句的虚拟表，`CREATE VIEW name AS SELECT ...`，不存储实际数据。

---

## 3. Row（行 / 记录）

- 行是表中的一条完整记录，同一表中所有行共享相同的列定义（Schema）。
- 一行中每个字段的值必须符合该列的数据类型和约束。
- 与 MongoDB 文档不同：**行的字段结构扁平**，一行内的某个字段不能是另一张子表或嵌套文档。表达「一对多」关系需要拆成多张表，通过外键关联。
- 例如，一个用户有多个收货地址，不能在用户行里嵌套数组，而要另建 `address` 表 + `user_id` 外键。

---

## 4. Column（列 / 字段）

- 列定义了字段名、数据类型、默认值、约束。
- 所有行的列结构一致——这是与 MongoDB 文档的最大区别。
- 字符集与排序规则（如 `utf8mb4_general_ci`）影响该列的存储和比较行为。

---

## 5. 数据类型速览

### 数值类型

| 类型 | 说明 | 字节 |
|------|------|------|
| `TINYINT` | -128 ~ 127（UNSIGNED: 0 ~ 255） | 1 |
| `SMALLINT` | -32,768 ~ 32,767 | 2 |
| `MEDIUMINT` | -8,388,608 ~ 8,388,607 | 3 |
| `INT`（INTEGER） | 约 ±21 亿（最常用） | 4 |
| `BIGINT` | 约 ±9.22 × 10¹⁸ | 8 |
| `FLOAT` | 单精度浮点数 | 4 |
| `DOUBLE` | 双精度浮点数 | 8 |
| `DECIMAL(M,D)` | 定点高精度小数（适合金额） | 变长 |

### 字符串类型

| 类型 | 说明 |
|------|------|
| `CHAR(N)` | 定长字符串，最多 255 字符，存储时右补空格。适合固定长度（如手机号） |
| `VARCHAR(N)` | 变长字符串，最多 65,535 字节。适合变长文本（最常用） |
| `TEXT` | 长文本，最多 65,535 字符 |
| `MEDIUMTEXT` | 中等长文本，最多约 16MB |
| `LONGTEXT` | 超大文本，最多约 4GB |
| `BLOB` 系列 | 二进制大对象（存图片、文件等），对照 TEXT 各档 |

### 日期时间类型

| 类型 | 格式 | 范围 |
|------|------|------|
| `DATE` | `YYYY-MM-DD` | 1000-01-01 ~ 9999-12-31 |
| `TIME` | `HH:MM:SS` | -838:59:59 ~ 838:59:59 |
| `DATETIME` | `YYYY-MM-DD HH:MM:SS` | 1000 ~ 9999（**推荐**，与时区无关） |
| `TIMESTAMP` | `YYYY-MM-DD HH:MM:SS` | 1970 ~ 2038（存 UTC，自动转时区） |
| `YEAR` | `YYYY` | 1901 ~ 2155 |

### 其他

| 类型 | 说明 |
|------|------|
| `BOOLEAN`（TINYINT(1)） | true = 1, false = 0 |
| `ENUM('a','b','c')` | 枚举，最多 65,535 个值 |
| `SET('a','b','c')` | 集合，最多 64 个成员 |
| `JSON` | JSON 类型（5.7.8+），支持 JSON 函数和虚拟列索引 |

---

## 6. 约束（Constraint）

约束保证数据完整性，定义在列级别：

| 约束 | 关键字 | 说明 |
|------|--------|------|
| **主键** | `PRIMARY KEY` | 唯一标识一行，NOT NULL + UNIQUE，一张表只能有一个 |
| **外键** | `FOREIGN KEY ... REFERENCES` | 引用另一张表的主键，保证引用完整性。MySQL 只有 InnoDB 引擎支持 |
| **唯一** | `UNIQUE` | 列值不能重复，允许 NULL（允许多个 NULL） |
| **非空** | `NOT NULL` | 列值不能为 NULL |
| **默认值** | `DEFAULT val` | 插入时若不提供该列则用默认值 |
| **自增** | `AUTO_INCREMENT` | 自动增长整数，通常用于主键，一张表只能有一个 |

### 外键与表关系

关系型数据库通过外键将多张表的行关联起来。常见三种关系：

| 关系类型 | 实现方式 | 举例 |
|---------|---------|------|
| **一对多**（最常见） | 「多」方加外键指向「一」方主键 | 用户 ↔ 订单：`order.user_id → user.id` |
| **多对多** | 建一张中间表，里面放两个外键 | 学生 ↔ 课程：中间表 `student_course(student_id, course_id)` |
| **一对一** | 外键 + UNIQUE 约束 | 用户 ↔ 用户详情：`user_detail.user_id UNIQUE → user.id` |

---

## 7. 索引（Index）

### 7.1 为什么需要索引

没有索引时，MySQL 需要从第一条记录扫描到最后一条（**全表扫描**），随着数据量增大查询越来越慢。索引就像书的目录，让 MySQL 可以快速定位到目标行，时间复杂度从 O(n) 降到 O(log n)。

### 7.2 索引的底层结构：B+Tree

InnoDB 的索引默认使用 **B+Tree**（平衡多路搜索树）：

```
                 [30｜60]              ← 非叶子节点（只存键 + 指针）
                /   |    \
         [10｜20]  [40｜50]  [70｜80]   ← 非叶子节点
          /  |  \   ...
         ↓   ↓   ↓
        [叶子节点：存完整行数据，双向链表连接]  ← 叶子节点
```

| 特性 | 说明 |
|------|------|
| **多路平衡** | 每个节点存储多个键值，高度很低（百万级数据通常 ≤ 3 层），磁盘 I/O 少 |
| **叶子节点存数据** | 所有数据最终在叶子节点；非叶子节点只用来路由 |
| **叶子节点有序 + 链表** | 叶子节点按主键排序，双向链表连接，支持范围查询和 ORDER BY 高效扫描 |
| **节点大小** | 默认 16KB（一页），与磁盘页对齐，一次 I/O 读一整个节点 |

### 7.3 聚簇索引 vs 二级索引（InnoDB）

InnoDB 的索引分为两类，这是 MySQL 面试最高频考点之一：

```
【聚簇索引（Clustered Index）】           【二级索引（Secondary Index）】
以主键构建的 B+Tree                       以普通列/唯一列构建的 B+Tree
叶子节点存的是 → 整行数据                    叶子节点存的是 → 主键值
（数据即索引，索引即数据）                    （查到主键后，再去聚簇索引查完整行）
                                               ↑ 这叫「回表」
```

**示意：**

```
-- 表结构
CREATE TABLE user (
  id INT PRIMARY KEY,        -- 聚簇索引
  name VARCHAR(50),
  age INT,
  INDEX idx_age (age)        -- 二级索引
);

-- 聚簇索引结构（以 id 为键）
[id=1 | name, age, ...] → [id=5 | name, age, ...] → [id=10 | name, age, ...]

-- 二级索引结构（以 age 为键，叶子存 id）
[age=20 | id=5] → [age=20 | id=12] → [age=25 | id=1]
         ↑ 回表：拿到 id=5，再去聚簇索引查完整行
```

| 对比 | 聚簇索引 | 二级索引 |
|------|---------|---------|
| 建在哪个字段 | 主键（无主键时用第一个 UNIQUE NOT NULL 索引，再没有建隐藏的 row_id） | 手动 CREATE INDEX 的列 |
| 叶子节点存什么 | 完整行数据 | 主键值 |
| 查询是否需要回表 | 不需要（查到即拿到全部字段） | 需要回表（除非覆盖索引） |
| 一张表能有几个 | **1 个** | 多个 |

> **为什么建议用自增整数做主键？** 插入新行时主键总是在 B+Tree 最右侧追加，不会引起页分裂和索引重建，写入性能最优。UUID 的随机性会导致频繁页分裂。

### 7.4 覆盖索引（Covering Index）

**如果查询需要的所有字段都在索引中，则不需要回表**，直接返回结果。这是最常见的 SQL 优化手段。

```sql
-- 有索引 INDEX idx_name_age (name, age)
SELECT name, age FROM user WHERE name = '张三';  -- ✅ 覆盖索引，Extra = Using index
SELECT name, age, email FROM user WHERE name = '张三';  -- ❌ 需要回表查 email
```

`EXPLAIN` 中 `Extra` 列显示 `Using index` 即表示覆盖索引。

### 7.5 复合索引与最左前缀原则

复合索引 `INDEX(a, b, c)` 相当于建了三个索引：`(a)` → `(a, b)` → `(a, b, c)`。

| WHERE 条件 | 是否命中索引 | 说明 |
|-----------|:---:|------|
| `WHERE a = 1` | ✅ | 命中 a（最左列） |
| `WHERE a = 1 AND b = 2` | ✅ | 命中 a + b |
| `WHERE a = 1 AND b = 2 AND c = 3` | ✅ | 命中全部 |
| `WHERE b = 2` | ❌ | 跳过 a，不符合最左前缀 |
| `WHERE a = 1 AND c = 3` | ⚠️ | 只命中 a，c 在中间断开了 |
| `WHERE a = 1 AND b > 2 AND c = 3` | ⚠️ | 命中 a + b（范围查询后的列失效） |
| `WHERE a LIKE 'abc%'` | ✅ | 范围匹配，但通配符在尾部才可用 |
| `WHERE a LIKE '%abc'` | ❌ | 前置通配符导致索引失效 |

**复合索引列顺序的选择原则：**
1. **等值查询列放最前**（`=`、`IN`）
2. **排序列其次**（`ORDER BY`）
3. **范围查询列放最后**（`>`、`<`、`BETWEEN`、`LIKE`）

> 口诀：**「等值在前，范围在后，排序中间」**

### 7.6 索引失效的常见情况

| 场景 | 说明 |
|------|------|
| `WHERE age + 1 = 20` | 索引列参与运算（应改为 `WHERE age = 19`） |
| `WHERE LEFT(name, 3) = 'abc'` | 索引列被函数包裹（应存为独立列或用前缀索引） |
| `WHERE name LIKE '%abc'` | 前置通配符 |
| `WHERE id = 1 OR name = 'a'` | OR 两边不是都有索引（name 没索引 → 全表扫描） |
| `WHERE name != 'a'` | `!=`/`<>`/`NOT IN` 通常不走索引 |
| `WHERE name IS NULL` | NULL 值判断，看优化器选择 |
| 隐式类型转换 | `WHERE phone = 13800138000` 但 phone 是 VARCHAR，MySQL 会对字符串列做函数转换导致索引失效 |
| 联合索引不满足最左前缀 | 跳过了最左列 |

### 7.7 索引类型汇总

| 类型 | 关键字 | 说明 |
|------|--------|------|
| 普通索引 | `INDEX` | 加速查询，值可重复 |
| 唯一索引 | `UNIQUE INDEX` | 值不可重复，NULL 可多次出现 |
| 主键索引 | `PRIMARY KEY` | 唯一 + 非空，即聚簇索引 |
| 复合索引 | `INDEX(a,b,c)` | 多列联合，遵循最左前缀 |
| 前缀索引 | `INDEX(col(N))` | 只索引前 N 个字符，省空间（适合 TEXT/BLOB） |
| 全文索引 | `FULLTEXT INDEX` | 文本搜索，`MATCH ... AGAINST` |
| 空间索引 | `SPATIAL INDEX` | 地理位置数据（GIS） |

### 7.8 EXPLAIN 查看执行计划

通过 `EXPLAIN` 分析 SQL 是否命中索引以及查询效率：

```sql
EXPLAIN SELECT * FROM user WHERE age > 20 ORDER BY name;
```

关键字段速查：

| 列 | 含义 | 关注点 |
|----|------|--------|
| `type` | 访问类型 | **最好到最差**：`const`（主键等值）→ `ref`（索引等值）→ `range`（索引范围）→ `index`（索引全扫）→ `ALL`（全表扫，**需优化**） |
| `key` | 实际使用的索引 | NULL 表示没用到索引 |
| `rows` | 预估扫描行数 | 越小越好 |
| `Extra` | 额外信息 | `Using index`（覆盖索引，最优）\| `Using filesort`（额外排序，需优化）\| `Using temporary`（临时表，需优化）\| `Using where`（回表查询） |

### 7.9 创建与维护索引

```sql
-- 创建索引
CREATE INDEX idx_name ON user(name);
CREATE UNIQUE INDEX idx_email ON user(email);
CREATE INDEX idx_name_age ON user(name, age);  -- 复合索引

-- 查看表的索引
SHOW INDEX FROM user;

-- 删除索引
DROP INDEX idx_name ON user;
ALTER TABLE user DROP INDEX idx_name;
```

### 7.10 索引最佳实践

1. **WHERE + ORDER BY + JOIN 列建索引**，但不要给每个列都建。
2. **复合索引优于多个单列索引**——MySQL 通常一次查询只用一个索引，多个单列索引会被忽略。
3. **区分度低的列不适合单独建索引**（如性别、状态字段），区分度 = `COUNT(DISTINCT col) / COUNT(*)`。
4. **长字符串用前缀索引**，平衡空间和区分度。
5. **频繁更新的列慎建索引**，维护索引有代价。
6. **删除不再使用的冗余索引**（如 `INDEX(a)` 是 `INDEX(a,b)` 的前缀，前者可删）。

---

## 8. 存储引擎

MySQL 通过**可插拔存储引擎**管理表的物理存储。最常用的两种：

| 特性 | InnoDB（默认，推荐） | MyISAM（旧引擎） |
|------|---------------------|------------------|
| **事务（ACID）** | ✅ 支持 | ❌ 不支持 |
| **外键** | ✅ 支持 | ❌ 不支持 |
| **行级锁** | ✅ 支持（高并发读写下性能好） | ❌ 表级锁 |
| **崩溃恢复** | ✅ 支持（redo log） | ❌ 不支持 |
| **全文索引** | 5.6+ 支持 | ✅ 支持 |
| **适用场景** | 绝大多数业务场景 | 历史遗留 / 只读日志表 |

- 查看引擎：`SHOW TABLE STATUS WHERE Name='table_name';`
- 指定引擎：`CREATE TABLE t (...) ENGINE=InnoDB;`
- 其他引擎（了解即可）：Memory（数据存内存，重启丢失）、Archive（压缩存储，只支持 INSERT/SELECT）、CSV（CSV 文件映射）。

---

## 9. 事务与 ACID

InnoDB 引擎支持事务，保证一组 SQL 操作要么全部成功，要么全部回滚。

| 特性 | 含义 | 实现机制 |
|------|------|---------|
| **A**tomicity 原子性 | 一组操作不可分割 | undo log 回滚 |
| **C**onsistency 一致性 | 事务前后数据满足约束 | redo log + undo log + 约束 |
| **I**solation 隔离性 | 多事务间不互相干扰 | MVCC + 锁 |
| **D**urability 持久性 | 提交后数据不丢失 | redo log 落盘 |

```sql
START TRANSACTION;
  UPDATE accounts SET balance = balance - 100 WHERE id = 1;
  UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;   -- 或 ROLLBACK; 回滚
```

### 隔离级别

| 级别 | 解决 | 存在 | 说明 |
|------|------|------|------|
| `READ UNCOMMITTED` | — | 脏读、不可重复读、幻读 | 几乎不用 |
| `READ COMMITTED` | 脏读 | 不可重复读、幻读 | Oracle 默认 |
| **`REPEATABLE READ`** | 脏读、不可重复读 | 幻读（InnoDB 通过 Next-Key Lock 基本消除） | **MySQL InnoDB 默认** |
| `SERIALIZABLE` | 全部 | — | 串行化，性能最差 |

- 查看：`SELECT @@transaction_isolation;`

---

## 10. 字符集与排序规则

- **字符集**（Character Set）：决定能存储哪些字符。
- **默认推荐**：`utf8mb4`（真正的 UTF-8，支持 emoji 等 4 字节字符）。注意 `utf8` 在 MySQL 中只支持 3 字节，是残缺的 UTF-8。
- **排序规则**（Collation）：决定字符如何比较和排序。`utf8mb4_general_ci` 通用且快，`utf8mb4_unicode_ci` 更准，`utf8mb4_bin` 以二进制比较（区分大小写）。`ci` = case-insensitive（大小写不敏感）。

```sql
CREATE DATABASE mydb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```



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
