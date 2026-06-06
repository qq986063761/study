// 参数类型，返回类型
function add(x: number, y: number): number { return x + y; }

let addfunc = function(x: number, y: number): number { return x + y; };

let addfunc1: (x: number, y: number) => number = function(x: number, y: number): number { return x + y; };

let addfunc2: (baseValue: number, increment: number) => number = function(x: number, y: number): number { return x + y; };

// ? 表示可选参数， = 可以提供默认值（默认值可传 undefined），...可以获取剩余参数
function getName(firstName: string, lastName?: string, num = 0, ...rest: string[]) {
  return firstName + lastName ? (' ' + lastName) : ''
}

// ========== 补充：函数重载 ==========
// 多个重载签名 + 一个实现签名
function pickCard(x: number): string
function pickCard(x: string): number
function pickCard(x: number | string): number | string {
  if (typeof x === "number") return "spade"
  return 7
}

// ========== 补充：类型守卫 ==========

// typeof 类型守卫 —— 收窄基础类型
function padLeft(val: string | number) {
  if (typeof val === "number") {
    // 此处 val 被收窄为 number
    return new Array(val + 1).join(" ")
  }
  // 此处 val 为 string
  return val
}

// instanceof 类型守卫 —— 收窄类实例类型
function formatDate(val: Date | string) {
  if (val instanceof Date) {
    return val.toISOString()
  }
  return val
}

// in 类型守卫 —— 判断对象是否包含某属性
interface Bird { fly(): void }
interface Fish { swim(): void }
function move(animal: Bird | Fish) {
  if ("fly" in animal) {
    animal.fly()  // 收窄为 Bird
  } else {
    animal.swim() // 收窄为 Fish
  }
}

// 自定义类型守卫 is —— 自定义收窄逻辑
function isString(val: unknown): val is string {
  return typeof val === "string"
}
if (isString("hello")) {
  // 此处 "hello" 被收窄为 string
}