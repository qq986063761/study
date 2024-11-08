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