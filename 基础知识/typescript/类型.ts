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