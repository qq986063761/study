// 参数类型，返回类型
function add(x: number, y: number): number { return x + y; }

let addfunc = function(x: number, y: number): number { return x + y; };

let addfunc1: (x: number, y: number) => number = function(x: number, y: number): number { return x + y; };

let addfunc2: (baseValue: number, increment: number) => number = function(x: number, y: number): number { return x + y; };

// ? 表示可选参数， = 可以提供默认值（默认值可传 undefined），...可以获取剩余参数
function getName(firstName: string, lastName?: string, num = 0, ...rest: string[]) {
  return firstName + lastName ? (' ' + lastName) : ''
}