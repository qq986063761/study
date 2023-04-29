// <T>定义泛型，泛型会根据传入的类型来作为类型规范
function getValue<T>(arg: T): T {
  return arg;
}

// 数组泛型
function getLogs<T>(arg: T[]): T[] {
  console.log(arg.length);
  return arg;
}
function loggingIdentity<T>(arg: Array<T>): Array<T> {
  console.log(arg.length);
  return arg;
}

// 类泛型
function create<T>(c: {new(): T; }): T {
  return new c();
}

// 接口泛型
interface GenericIdentityFn<T> {
  (arg: T): T;
}
function identity<T>(arg: T): T {
  return arg;
}
let myIdentity: GenericIdentityFn<number> = identity;

// 类泛型
class GenericNumber<T> {
  zeroValue: T;
  add: (x: T, y: T) => T;
}
let myGenericNumber = new GenericNumber<number>();

// 泛型继承
interface Lengthwise {
  length: number;
}
function logging<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}