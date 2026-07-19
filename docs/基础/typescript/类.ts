// 定义类
class Animal {
  // 属性（private：私有、public：公有、protected：被保护的，允许子类内部访问、static：静态属性，所有实例公用一个变量、readonly：只读属性）
  protected name: string;
  // 只读，只允许声明初始化或构造中初始化
  readonly age: number = 24;

  // 构造函数
  constructor(name: string) {
    this.name = name;
  }

  // 方法
  getName() {
    return this.name;
  }

  say() {
    alert(`my name is ${this.getName()}`);
  }
}

// 继承
class Dog extends Animal {
  private _name: string;

  constructor(name: string) { 
    // 继承父类构造
    super(name)
    this._name = name
  }

  // getters/setters截取属性
  get fullName(): string {
    return this._name;
  }

  set fullName(newName: string) {
    this._name = newName;
  }

  say() {
    alert(`wang wang`);
  }
}

// 抽象类
abstract class PhoneFactory {
  // 抽象方法，子类必须实现
  abstract getPhone(type: string): void;
  // 非抽象方法可在抽象类中实现
  callPhone() {
    alert('嘀嘀嘀...')
  }
}

// 继承抽象类
class IphoneFactory extends PhoneFactory {
  // 实现抽象方法
  getPhone(type: string): string {
    return `${type} phone`;
  }
}

// ========== 补充：this 参数类型 ==========
// 函数/方法的第一个参数可声明 this 类型，约束调用时的上下文
class Card {
  suit: string
  rank: number
  click(this: Card) {
    // 必须先 new Card() 实例调用，不能单独解构使用
    console.log(this.suit)
  }
}

// ========== 补充：装饰器 (experimental) ==========
// 需要 tsconfig 开启 experimentalDecorators: true
// 类装饰器 —— 接收构造函数，可修改或替换类
function sealed(constructor: Function) {
  Object.seal(constructor)
  Object.seal(constructor.prototype)
}

// 方法装饰器 —— 可拦截/增强方法
function log(target: any, key: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value
  descriptor.value = function (...args: any[]) {
    console.log(`调用 ${key}，参数：`, args)
    return original.apply(this, args)
  }
}

@sealed
class Calculator {
  @log
  add(a: number, b: number): number {
    return a + b
  }
}