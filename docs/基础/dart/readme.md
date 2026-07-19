# Dart 语言要点（理论向）

Dart 是面向对象、类基于单继承的编程语言，由 Google 设计，常用于 Flutter、服务端（Dart VM）与命令行工具。下面按「语言模型 → 类型与空安全 → 异步 → 生态」做极简梳理，并附**常用语法速查**。

## 语言模型

- **一切皆对象**：数字、函数、`null` 等均为对象；没有原始类型与包装类型的分裂（使用上统一）。
- **基于类与 mixin**：单继承 + `mixin` 组合行为，接口通过「隐式接口」（每个类即接口）实现。
- **顶层入口**：`main()` 为程序入口；库通过 `import` / `export` 组织，支持 `part` 拆分大文件。

## 类型系统与空安全（Sound null safety）

- **静态类型 + 类型推断**：多数位置可写类型，也可用 `var` / `final` 由编译器推断。
- **可空与非空**：`String` 不可为 `null`，`String?` 可为 `null`；访问可空类型前需判空、`?.`、`!` 或 `??` 等，减少 NPE 类问题。
- **后期绑定**：`late` 表示稍后初始化，适用于依赖注入或 `initState` 后再赋值的场景。

## 函数与闭包

- **一等函数**：函数可作参数、返回值；闭包捕获外层变量。
- **命名参数与可选参数**：`{}` 命名、`[]` 位置可选，支持默认值，利于可读 API 设计。

## 异步模型

- **`async` / `await`**：基于 **Future**（单次异步）与 **Stream**（事件序列）。
- **事件循环**：Dart 在单线程 isolate 中运行事件循环；CPU 密集任务可用 `Isolate` 或 `compute` 避免阻塞 UI。

## 面向对象特性

- **构造器**：命名构造、工厂构造 `factory`、初始化列表、重定向构造。
- **扩展方法 `extension`**：在不修改原类的前提下为类型增加方法。
- **枚举增强**：可带成员、可实现接口，适合有限状态建模。

## 与 Flutter 的关系

- UI 使用 **声明式**：`Widget` 描述配置，框架根据 `State` 变化做 **diff 与重建**；业务状态常放在 `State` / `InheritedWidget` / **Provider、Riverpod、Bloc** 等方案中。
- **Dart 是 Flutter 的单一语言栈**：同一套类型与工具链覆盖逻辑、界面与部分构建脚本。

---

## 常用语法速查

### 1. 变量与常量

```dart
// 类型推断
var name = 'Dart';          // 可再赋值，类型由初值锁定
var count = 0;

// 显式类型
String title = 'Hello';
int age = 18;
double price = 9.9;
bool ok = true;
num n = 1;                  // int 或 double 的父类型
Object obj = 'anything';
dynamic d = 1;              // 关闭静态检查，可改类型
d = 'now string';

// 不可变
final city = 'Beijing';     // 运行时赋值一次
const pi = 3.14;            // 编译期常量
const list = [1, 2, 3];     // 深层编译期常量

// 延迟初始化（非空，但稍后赋值）
late String token;
token = fetchToken();

// 可空
String? maybeName;
int? score;
```

| 关键字 | 含义 |
|--------|------|
| `var` | 可再赋值，类型由推断锁定 |
| `final` | 运行时赋值一次，不可再改引用 |
| `const` | 编译期常量 |
| `late` | 非空但延迟初始化 |
| `dynamic` | 关闭静态类型检查 |

> `final` 的对象内部字段仍可能可变；要「编译期 + 深层不可变」用 `const`。

---

### 2. 内置类型与字面量

```dart
// 数字
int a = 10;
double b = 3.14;
var hex = 0xFF;
var exp = 1.2e3;

// 字符串
var s1 = 'single';
var s2 = "double";
var multi = '''
多行
字符串
''';
var raw = r'C:\path\file';   // 原始字符串，不转义
var name = 'Wan';
var greet = 'Hello, $name!'; // 插值
var expr = 'sum = ${1 + 2}';

// 布尔：只有 true / false，不能用 0/1 或非空当真值
if (ok) { /* ... */ }

// 集合字面量
var list = [1, 2, 3];
var set = {'a', 'b'};
var map = {'id': 1, 'name': 'x'};

// 类型注解
List<int> nums = [1, 2];
Set<String> tags = {'dart', 'flutter'};
Map<String, int> scores = {'math': 90};

// 空集合
var emptyList = <int>[];
var emptyMap = <String, dynamic>{};
```

---

### 3. 运算符

```dart
// 算术 / 比较 / 逻辑
a + b; a - b; a * b; a / b;   // / 得到 double
a ~/ b;                       // 整除
a % b;
a == b; a != b; a > b;
a && b; a || b; !a;

// 类型判断与转换
obj is String;
obj is! int;
(obj as String).length;

// 赋值与复合
a ??= 10;                     // 仅当 a 为 null 时赋值
a += 1;

// 级联（对同一对象连续调用）
var sb = StringBuffer()
  ..write('Hello')
  ..write(' ')
  ..write('Dart');

// 空安全相关
String? s;
print(s?.length);             // 安全调用，null 则整体为 null
print(s ?? 'default');        // 空合并
print(s?.length ?? 0);
s!;                           // 断言非 null（为 null 会抛）
s?.toUpperCase();
```

| 运算符 | 作用 |
|--------|------|
| `?.` | 空安全访问 |
| `??` | 空则用右侧 |
| `??=` | 空则赋值 |
| `!` | 断言非空 |
| `..` / `?..` | 级联调用 |
| `is` / `as` | 类型检查 / 强转 |
| `~/` | 整除 |

---

### 4. 控制流

```dart
// if / else
if (score >= 90) {
  print('A');
} else if (score >= 60) {
  print('pass');
} else {
  print('fail');
}

// 三元
var label = ok ? 'yes' : 'no';

// for
for (var i = 0; i < 3; i++) {
  print(i);
}
for (var item in list) {
  print(item);
}
// for-each
list.forEach((e) => print(e));

// while / do-while
while (n > 0) {
  n--;
}
do {
  n++;
} while (n < 3);

// switch（Dart 3 支持模式匹配）
switch (status) {
  case 'loading':
    print('...');
  case 'success':
  case 'done':
    print('ok');
  default:
    print('other');
}

// break / continue / return
// assert（仅 debug 生效）
assert(age >= 0, 'age must be non-negative');
```

---

### 5. 集合操作（List / Set / Map）

```dart
var list = [1, 2, 3];
list.add(4);
list.addAll([5, 6]);
list.insert(0, 0);
list.remove(2);
list.removeAt(0);
list.length;
list.isEmpty;
list.contains(3);
list.indexOf(3);
list.first;
list.last;
list.sublist(1, 3);

// 展开运算符
var more = [0, ...list, 99];
var maybe = [1, if (ok) 2, for (var i in [3, 4]) i * 10]; // 集合 if / for

// 常用高阶方法
list.map((e) => e * 2).toList();
list.where((e) => e > 1).toList();
list.any((e) => e > 2);
list.every((e) => e > 0);
list.fold(0, (sum, e) => sum + e);
list.reduce((a, b) => a + b);
list.sort((a, b) => a.compareTo(b));

// Set
var set = {1, 2, 2};          // {1, 2}
set.add(3);
set.contains(1);
set.intersection({2, 3});
set.union({3, 4});
set.difference({1});

// Map
var map = {'a': 1, 'b': 2};
map['c'] = 3;
map['a'];                     // 1
map['z'];                     // null
map.containsKey('a');
map.keys;
map.values;
map.forEach((k, v) => print('$k=$v'));
map.putIfAbsent('d', () => 4);
map.remove('b');
// 空安全读
var v = map['a'] ?? 0;
```

---

### 6. 函数

```dart
// 普通函数
int add(int a, int b) {
  return a + b;
}

// 箭头函数（单表达式）
int mul(int a, int b) => a * b;

// 可选位置参数 []
String join(String a, [String b = '', String c = '']) {
  return '$a$b$c';
}
join('a');
join('a', 'b');

// 命名参数 {}（常用，Flutter API 大量使用）
void log(String msg, {String level = 'info', bool color = false}) {
  print('[$level] $msg');
}
log('hi');
log('err', level: 'error', color: true);

// required 命名参数
void createUser({required String name, int age = 0}) {}
createUser(name: 'Tom');

// 函数作参数 / 返回值
void run(void Function(int) cb) {
  cb(1);
}
run((x) => print(x));

typedef IntOp = int Function(int, int);
int apply(IntOp op, int a, int b) => op(a, b);

// 匿名函数 / 闭包
var list = [1, 2, 3];
list.forEach((e) {
  print(e);
});
Function makeAdder(int x) {
  return (int y) => x + y;    // 捕获 x
}
var add2 = makeAdder(2);
print(add2(3));               // 5
```

---

### 7. 类与面向对象

```dart
class Person {
  // 字段
  String name;
  int age;
  final String id;            // 只能在构造时赋值
  static int count = 0;       // 静态成员
  static const species = 'human';

  // 默认构造 + 初始化列表
  Person(this.name, this.age, {required this.id}) {
    count++;
  }

  // 命名构造
  Person.guest()
      : name = 'guest',
        age = 0,
        id = '0';

  // 重定向构造
  Person.baby(String name) : this(name, 0, id: 'baby');

  // 工厂构造（可返回缓存实例 / 子类）
  factory Person.fromJson(Map<String, dynamic> json) {
    return Person(json['name'] as String, json['age'] as int, id: json['id'] as String);
  }

  // getter / setter
  String get label => '$name($age)';
  set ageYears(int v) {
    if (v >= 0) age = v;
  }

  // 方法
  void sayHi() => print('Hi, $name');

  // 操作符重载
  Person operator +(Person other) {
    return Person('$name&${other.name}', age + other.age, id: '$id+${other.id}');
  }

  @override
  String toString() => 'Person($name, $age)';
}

// 继承：单继承
class Student extends Person {
  String school;

  Student(super.name, super.age, {required super.id, required this.school});

  @override
  void sayHi() {
    super.sayHi();
    print('from $school');
  }
}

// 抽象类
abstract class Animal {
  void eat();                 // 抽象方法，子类必须实现
  void sleep() => print('zz');
}

// 接口：每个 class 都是隐式接口
class Flyable {
  void fly() {}
}
class Bird implements Flyable {
  @override
  void fly() => print('fly');
}

// mixin：组合能力（多「混入」）
mixin Logger {
  void log(String msg) => print('[log] $msg');
}
mixin Timestamp {
  DateTime get now => DateTime.now();
}
class Service with Logger, Timestamp {
  void run() {
    log('at $now');
  }
}

// 可见性：无 public/private 关键字
// 以下划线 _ 开头 = 库内私有
class _Internal {}
void _privateFn() {}
```

---

### 8. 枚举

```dart
// 简单枚举
enum Status { loading, success, error }

void handle(Status s) {
  switch (s) {
    case Status.loading:
      break;
    case Status.success:
      break;
    case Status.error:
      break;
  }
}

// 增强枚举（可带字段、方法）
enum Color {
  red('FF0000'),
  green('00FF00'),
  blue('0000FF');

  final String hex;
  const Color(this.hex);

  String get css => '#$hex';
}

print(Color.red.css);         // #FF0000
print(Color.values);          // 全部取值
print(Color.red.name);        // red
print(Color.red.index);       // 0
```

---

### 9. 扩展方法（extension）

```dart
extension StringX on String {
  bool get isBlank => trim().isEmpty;
  String repeat(int n) => List.filled(n, this).join();
}

print('  '.isBlank);          // true
print('ab'.repeat(3));        // ababab

// 可空类型上的扩展
extension NullableStringX on String? {
  String orEmpty() => this ?? '';
}
```

---

### 10. 空安全常用写法

```dart
String? name;

// 1. 判空提升（promotion）
if (name != null) {
  print(name.length);         // 此处 name 已是 String
}

// 2. 本地拷贝（闭包/异步里更稳妥）
var local = name;
if (local != null) {
  print(local.length);
}

// 3. ?.  ??  ??=  !
print(name?.toUpperCase() ?? 'N/A');
name ??= 'default';
// var len = name!.length;    // 确定非空再用

// 4. 集合里过滤 null
List<String?> raw = ['a', null, 'b'];
List<String> clean = raw.whereType<String>().toList();
// 或
List<String> clean2 = [
  for (var e in raw)
    if (e != null) e,
];
```

---

### 11. 异步：Future / Stream

```dart
// Future：单次异步结果
Future<String> fetchName() async {
  await Future.delayed(Duration(seconds: 1));
  return 'Dart';
}

Future<void> main() async {
  // await
  var name = await fetchName();
  print(name);

  // then / catchError / whenComplete
  fetchName()
      .then((v) => print(v))
      .catchError((e) => print(e))
      .whenComplete(() => print('done'));

  // 并行
  var results = await Future.wait([fetchName(), fetchName()]);

  // 超时
  await fetchName().timeout(Duration(seconds: 2));
}

// async* + yield：生成 Stream
Stream<int> countStream(int n) async* {
  for (var i = 0; i < n; i++) {
    await Future.delayed(Duration(milliseconds: 100));
    yield i;
  }
}

Future<void> listen() async {
  // await for
  await for (var v in countStream(3)) {
    print(v);
  }

  // listen
  countStream(3).listen(
    (v) => print(v),
    onError: (e) => print(e),
    onDone: () => print('done'),
    cancelOnError: true,
  );

  // 常用变换
  countStream(5)
      .where((e) => e.isEven)
      .map((e) => e * 10)
      .take(2)
      .toList();
}
```

| 类型 | 含义 | 消费方式 |
|------|------|----------|
| `Future<T>` | 一次异步结果 | `await` / `.then` |
| `Stream<T>` | 多次异步事件 | `await for` / `.listen` |

---

### 12. 泛型

```dart
// 泛型类
class Box<T> {
  T value;
  Box(this.value);
}

var intBox = Box<int>(1);
var strBox = Box('hi');       // 推断 Box<String>

// 泛型函数
T first<T>(List<T> list) => list.first;

// 约束
class IdBox<T extends num> {
  T id;
  IdBox(this.id);
}

// 常见集合泛型
List<String> names = [];
Map<String, dynamic> json = {};
Future<List<User>> loadUsers() async => [];
```

---

### 13. 库与导入

```dart
// 导入
import 'dart:async';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;   // 前缀，避免命名冲突
import 'src/utils.dart' show max, min;     // 只导入部分
import 'src/debug.dart' hide internalLog;  // 隐藏部分
import 'src/secret.dart' deferred as secret; // 延迟加载

// 延迟加载使用
Future<void> loadSecret() async {
  await secret.loadLibrary();
  secret.run();
}

// 导出（库的门面）
export 'src/a.dart';
export 'src/b.dart' show PublicApi;

// part / part of：拆分同一库的多文件（较少用，代码生成场景多见）
// library my_lib;
// part 'my_lib.g.dart';
```

---

### 14. 异常处理

```dart
try {
  var n = int.parse('x');
  if (n < 0) {
    throw ArgumentError('must be >= 0');
  }
} on FormatException catch (e, st) {
  print('format: $e');
  print(st);                  // 堆栈
} on ArgumentError catch (e) {
  print('arg: $e');
} catch (e) {
  print('other: $e');
  rethrow;                    // 继续抛出
} finally {
  print('cleanup');
}

// 自定义异常
class AppException implements Exception {
  final String message;
  AppException(this.message);
  @override
  String toString() => 'AppException: $message';
}
```

---

### 15. 常用内置 API 速记

```dart
// 字符串
'  hi  '.trim();
'a,b,c'.split(',');
['a', 'b'].join('-');
'hello'.contains('ll');
'hello'.startsWith('he');
'hello'.replaceAll('l', 'L');
'hello'.substring(1, 3);      // el
int.parse('42');
double.tryParse('3.14');      // 失败返回 null
'42'.padLeft(5, '0');         // 00042

// 日期
var now = DateTime.now();
var d = DateTime(2026, 7, 16);
var utc = DateTime.utc(2026, 1, 1);
d.add(Duration(days: 1));
d.difference(now);            // Duration
d.isBefore(now);
d.toIso8601String();

// Duration
Duration(seconds: 1, milliseconds: 500);

// 转换 JSON（dart:convert）
import 'dart:convert';
var map = jsonDecode('{"a":1}') as Map<String, dynamic>;
var str = jsonEncode({'a': 1});

// 打印与调试
print(obj);
debugPrint(msg);              // Flutter 中避免丢日志
assert(condition);
```

---

### 16. 记录（Records）与模式匹配（Dart 3+）

```dart
// 记录：轻量多值返回
(String, int) userInfo() => ('Tom', 18);
var (name, age) = userInfo();

var point = (x: 1, y: 2);     // 命名字段
print(point.x);

// switch 模式匹配
Object value = 42;
var desc = switch (value) {
  int n when n > 0 => 'positive int',
  int _ => 'other int',
  String s => 'str: $s',
  [var a, var b] => 'list $a,$b',
  {'id': var id} => 'map id=$id',
  _ => 'unknown',
};

// if-case
if (value case int n when n > 10) {
  print(n);
}
```

---

### 17. 与 JS/TS 对照（方便前端切换）

| 场景 | JavaScript / TS | Dart |
|------|-----------------|------|
| 变量 | `let` / `const` | `var` / `final` / `const` |
| 可空 | `string \| null` | `String?` |
| 可选链 | `a?.b` | `a?.b` |
| 空合并 | `a ?? b` | `a ?? b` |
| 箭头函数 | `() => {}` | `() => expr` 或 `() {}` |
| 命名参数 | 无语言级 | `{required this.x}` |
| Promise | `async/await` | `Future` + `async/await` |
| 流 | RxJS 等 | `Stream` |
| 私有 | `#field` / `private` | `_field`（库内私有） |
| 接口 | `interface` | `class` 即接口 / `implements` |
| Mixin | 无标准 | `mixin` / `with` |
| 模块 | `import/export` | `import` / `export` / `show` / `hide` |
| this 绑定 | 需注意 | 无动态 `this` 问题 |

---

### 延伸阅读

- 官方语言概览：<https://dart.dev/overview>
- 语言导览（语法）：<https://dart.dev/language>
- 空安全说明：<https://dart.dev/null-safety>
- 异步教程：<https://dart.dev/codelabs/async-await>
- 核心库：<https://dart.dev/libraries>
