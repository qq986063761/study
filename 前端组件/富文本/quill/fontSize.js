// 支持 fontsize
class fontSize extends Inline {
  static blotName = 'fontSize';
  static tagName = 'span';
  
  static create(value) {
    const node = super.create();
    node.style.fontSize = value;
    return node;
  }
  
  static formats(node) {
    return node.style.fontSize;
  }
}
Quill.register(fontSize)