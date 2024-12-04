// 自定义列表
class CustomListContainer extends Container {
  static blotName = 'customListContainer';
  static tagName = 'ol';
}

class CustomListItem extends Block {
  static blotName = 'customList';
  static tagName = 'li';

  static register() {
    Quill.register(CustomListContainer);
  }

  static create(value) {
    const node = super.create();
    node.className = 'custom-list-item'
    node.setAttribute('data-list-custom', value)
    return node;
  }
  
  static formats(node) {
    return node.getAttribute('data-list-custom')
  }

  constructor(scroll, domNode) {
    super(scroll, domNode);
    const ui = domNode.ownerDocument.createElement('span');
    const listEventHandler = (e) => {
      if (!scroll.isEnabled()) return;
      const format = this.statics.formats(domNode, scroll);
      // console.log('constructor format', format, e)
    };
    ui.addEventListener('mousedown', listEventHandler);
    ui.addEventListener('touchstart', listEventHandler);
    this.attachUI(ui);
  }

  format(name, value) {
    if (name === this.statics.blotName && value) {
      this.domNode.setAttribute('data-list-custom', value);
    } else {
      super.format(name, value);

      // 当移除自定义格式时，添加空白行逻辑
      console.log('name', name, value)
      // if (name === this.statics.blotName && !value) {
      //     const blankNode = document.createElement('br'); // 或者创建一个空白文本节点等方式
      //     this.domNode.appendChild(blankNode);
      // }
    }
  }
}
CustomListContainer.allowedChildren = [CustomListItem];
CustomListItem.requiredContainer = CustomListContainer;
Quill.register(CustomListItem)