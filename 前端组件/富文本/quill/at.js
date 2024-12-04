// @人
class atBtn extends Inline {
  static blotName = 'atBtn';
  static tagName = 'span';
  static className = 'editor-at';
  
  static create(value) {
    const node = super.create();
    // node.setAttribute('data-at', value)
    node.setAttribute('contenteditable', false);
    if (value.usrId) {
      node.dataset.usrid = value.usrId
    }
    if (value.label) {
      node.innerHTML = '@' + value.label
    }

    return node;
  }
  
  static formats(node) {
    return node.className
    // return node.getAttribute('data-at')
  }

  // format(name, value) {
  //   if (name === 'at' && value) {
  //     this.domNode.setAttribute('data-mention', value)
  //   } else {
  //     super.format(name, value)
  //   }
  // }

  static value(node) {
    // console.log('atBtn value', node)
    return {
      label: node.innerHTML.replace('@', ''),
      usrId: node.dataset.usrid
    };
  }
}
Quill.register(atBtn)