// 定义对象接口类型（规定属性类型和性质）
interface Lab {
  // 必填
  lab: string
}

// 接口继承（可继承多个接口，逗号间隔）
interface LabValue extends Lab {
  // 可选
  size?: number;
  // 只读
  readonly require: boolean;
}

function printLab(obj: LabValue) {
  // 非必须实现属性可方便校验
  if (!obj.size) {
    console.log(`size: 暂无size属性`);
  } else {
    console.log(`size: ${obj.size}`);
  }

  // 采用类型断言，可让只读变量被修改
  let tmp = obj.require as boolean;
  tmp = false;
}

printLab({
  require: true, 
  size: 10, 
  lab: "很长的一段文本"
});

// 定义函数接口（规定参数类型和返回值类型）
interface SearchFunc {
  (source: string, keyword: string): boolean;
}

let search: SearchFunc = function (source: string, keyword: string) {
  return keyword && source.indexOf(keyword) > -1;
}

// 定义索引类型接口（规定索引类型和值的类型）
interface StringArray {
  [index: number]: string;
}
let list: StringArray;
list = ["Bob", "Fred"];

// 定义类类型接口（规定类属性和方法规则）
interface ClockInterface {
  currentTime: Date
  callback(param: number): number
}

// 定义类的时候去实现接口的规则
class Clock implements ClockInterface {
  currentTime: Date
  callback(param: number): number {return 0}
  constructor(h: number, m: number) {}
}