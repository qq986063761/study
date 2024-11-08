function isDef(val) {
  return val !== undefined && val !== null && val !== ''
}

class LinkNode {
  constructor(value) {
    this.value = value
    this.next = null
  }
}

// 单项链表
class LinkList {
  constructor(arr, isCycle) {
    // 创建空的头节点
    this.head = new LinkNode(null)
    this.size = 0

    if (arr) {
      arr.forEach(value => this.addNode(value))
      
      // 需要自成环
      if (isCycle) {
        const lastNode = this.find()
        lastNode.next = this.head
      }
    }
  }

  find(index, type) {
    const findIndex = isDef(index) ? Number(index) : this.size - 1
    let currentIndex = 0
    let currentNode = this.head

    if (findIndex === -1) return currentNode

    while (findIndex !== currentIndex && currentIndex <= this.size) {
      currentIndex++
      currentNode = currentNode.next
    }

    return type === 'prev' ? currentNode : currentNode.next
  }

  addNode(value, index) {
    const newNode = new LinkNode(value)
    const prevNode = this.find(index, isDef(index) ? 'prev' : '') // 插入节点才传 prev，因为需要前一个节点 next 来追加节点

    // 插入节点时先存下个节点，然后挂到新节点的 next
    newNode.next = prevNode.next
    prevNode.next = newNode
    this.size++
  }

  removeNode(index) {
    index = isDef(index) ? index : Number(this.size - 1)

    // 因为删除的时候要从前一个节点的 next 删除，所以多传了一个类型
    const prevNode = this.find(index, 'prev')
    prevNode.next = prevNode.next.next
    this.size--
  }
}