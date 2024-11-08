// 二叉树节点
class TreeNode {
  constructor(value) {
    this.value = value
    this.left = null 
    this.right = null
  }
}

// 二叉搜索树
class Tree {
  constructor() {
    this.root = null
  }

  _add(node, value) {
    // 避免重复
    if (value === node.value) return

    if (value < node.value) {
      if (!node.left) {
        node.left = new TreeNode(value)
      } else {
        this._add(node.left, value)
      }
    } else {
      if (!node.right) {
        node.right = new TreeNode(value)
      } else {
        this._add(node.right, value)
      }
    }
  }

  add(value) {
    if (!this.root) {
      this.root = new TreeNode(value)
    } else {
      this._add(this.root, value)
    }
  }

  // 先序遍历
  _pre(node) {
    if (node) {
      console.log(node.value)
      this._pre(node.left)
      this._pre(node.right)
    }
  }

  // 深度优先
  dfs() {
    this._pre(this.root)
  }

  // 广度优先
  bfs() {
    let queue = []
    queue.push(this.root)
    
    while (queue.length) {
      const node = queue[0]
      console.log(node.value)

      if (node.left) queue.push(node.left)
      if (node.right) queue.push(node.right)

      queue.shift()
    }
  }

  _remove(node, value, parentNode) {
    if (!node) return

    if (node.value === value) {
      if (!parentNode) {
        this.root = null
        return
      }

      if (!node.left && !node.right) {
        if (parentNode.left === node) {
          parentNode.left = null
        } else {
          parentNode.right = null
        }
      } else if (node.left && !node.right) {
        if (parentNode.left === node) {
          parentNode.left = node.left
        } else {
          parentNode.right = node.left
        }
      } else if (!node.left && node.right) {
        if (parentNode.left === node) {
          parentNode.left = node.right
        } else {
          parentNode.right = node.right
        }
      } else {
        if (parentNode.left === node) {
          node.right.left = node.left
          parentNode.left = node.right
        } else {
          node.left.right = node.right
          parentNode.right = node.left
        }
      }
    } else if (value > node.value) {
      this._remove(node.right, value, node)
    } else {
      this._remove(node.left, value, node)
    }
  }

  remove(value) {
    this._remove(this.root, value, null)
  }

  // getHeight(node, currentHeight = 1) {
  //   if (!node.left && !node.right) return currentHeight

  //   const leftHeight = node.left ? this.getHeight(node.left, currentHeight + 1) : currentHeight
  //   const rightHeight = node.right ? this.getHeight(node.right, currentHeight + 1) : currentHeight
    
  //   return Math.max(leftHeight, rightHeight)
  // }

  _search(node, value) {
    if (!node) return null

    if (node.value === value) {
      return node
    } else if (value > node.value) {
      return this._search(node.right, value)
    } else {
      return this._search(node.left, value)
    }
  }

  search(value) {
    this.search(this.root, value)
  }
}