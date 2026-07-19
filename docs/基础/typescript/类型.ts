// boolean
let ready: boolean = true

// number 支持 16进制（0xf00d）、八进制（0o744）、二进制（0b1010）
let num: number = 6

// string
let myName: string = `name: ${ready}`

// array，两种方式：元素类型[] 和 泛型<元素类型>
let list1: number[] = [1, 2, 3]
let list2: Array<number> = [1, 2, 3]

// 元组 Tuple，强制指定长度和类型
let list3: [string, number] = ['wanpeng', 1]

// any 用于未知类型
let anyValue: any = 4

// void，常用于函数无返回值时作为返回的类型 只能赋值 undefined 和 null
let unusable: void = undefined
// undefined 和 null
let u: undefined = undefined
let n: null = null

// 对象类型
let obj: object = {}

// never 类型，用在不存在返回值或者异常情况
function error(message: string): never {
  throw new Error(message)
}

// 联合类型 用于兼容多种类型
function getUnionVal(value: string | number) {}

// 字面量类型，指定变量的所有可能值
let union1: 1 | 2 | 3

// 枚举类型 默认从 0 递增，可自定义默认枚举值，往后枚举值以此递增
enum Direction {
  Up = 1,
  Down,
  Left,
  Right
}

// 反向映射出名字
let dir = Direction.Up;
let enumName = Direction[dir];

// 常量枚举
const enum Color {
  Red,
  Green,
  Blue
}

// ========== 补充：其他核心类型 ==========

// unknown 类型 —— 比 any 安全，使用前必须先收窄类型
let unknownVal: unknown = 4
if (typeof unknownVal === "string") {
  // 这里 unknownVal 被收窄为 string
  unknownVal.toUpperCase()
}

// never 穷举检查 —— 用于 switch/default 分支，确保所有情况已覆盖
type Shape = "circle" | "square"
function getArea(shape: Shape) {
  switch (shape) {
    case "circle": return Math.PI
    case "square": return 1
    default:
      // 如果 Shape 新增了类型但此处未处理，编译期就会报错
      const _exhaustive: never = shape
      return _exhaustive
  }
}

// 交叉类型 & —— 合并多个类型
interface Name { name: string }
interface Age { age: number }
type Person = Name & Age  // { name: string; age: number }

// 非空断言 ! —— 告诉编译器值一定不为 null/undefined
function getLength(str: string | null) {
  // 确信 str 不为 null 时可用 ! 跳过检查
  return str!.length
}

// const 断言 as const —— 将值锁定为最深层的字面量只读类型
const config = { mode: "dark", size: 14 } as const
// config 类型为 { readonly mode: "dark"; readonly size: 14 }

// Symbol —— 唯一值类型
const sym1: symbol = Symbol("key")
const sym2: unique symbol = Symbol("unique")  // unique symbol 只能是 const 声明

// BigInt —— 大整数
const big: bigint = 9007199254740991n