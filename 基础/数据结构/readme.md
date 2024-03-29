# 资源
- [github上star2w+的文章](https://github.com/trekhleb/javascript-algorithms/blob/master/README.zh-CN.md);

# 时间复杂度
- 衡量一个算法的执行时间好坏的指标
- O(1)：操作和数据量无关，固定时间操作（如：四则运算）
- O(N)：将 N 个数据进行相同操作

# 空间复杂度
- 衡量一个算法的内存占用趋势的指标

# 栈
- 线性结构，先进后出，两个操作（入栈，出栈）
- 时间复杂度
  - 查找：O(n)
  - 插入、删除：O(1)，只考虑插入到栈顶和从栈顶删除
- [数据结构图例](https://camo.githubusercontent.com/464c4087d283619fe8e8c77cf5805e45faa54ca9/68747470733a2f2f75706c6f61642e77696b696d656469612e6f72672f77696b6970656469612f636f6d6d6f6e732f622f62342f4c69666f5f737461636b2e706e67)

# 队列
- 线性结构，先进先出，两个操作（入队列、出队列）
- 时间复杂度
  - 查找：O(n)
  - 插入、删除：O(1)
- [数据结构图例](https://camo.githubusercontent.com/7fecf0b843d5f7b26e4514b4e9e047d6c84ee76b/68747470733a2f2f75706c6f61642e77696b696d656469612e6f72672f77696b6970656469612f636f6d6d6f6e732f352f35322f446174615f51756575652e737667)

# 链表
- 线性结构，节点之间通过指针关联
- 单链表：每个节点只有一个指针指向下一个节点
- 双向链表：每个节点有两个指针（prev 和 next），prev 指向上一个节点，next 指向下一个节点
- 循环链表：每个节点指向下一个节点，尾节点指向头节点
- 时间复杂度
  - 查找：O(n)，因为需要遍历整个链表
  - 插入、删除：O(1)，只需更改插入位置附近节点的指针指向
- [数据结构图例](https://camo.githubusercontent.com/37013b59008ed49a6701968da6b182eb6a9d24c8/68747470733a2f2f75706c6f61642e77696b696d656469612e6f72672f77696b6970656469612f636f6d6d6f6e732f362f36642f53696e676c792d6c696e6b65642d6c6973742e737667)

# 树
- 多节点层次关系结构，每个节点有 0 或多个子节点
  - 根节点：没有父节点
  - 叶子节点：没有子节点
  - 层次：根节点在第一层，每往下加一层
  - 高度：叶子节点的高度是1，每往上一层高度加1
  - 度：一个节点的子树分支数



# 二叉树
- 每个节点最多两个子节点，每个子节点也是一颗二叉树
- 满二叉树：当所有节点数为（2 的层数次方 - 1）时为满二叉树，也就是最后一层所有节点无任何子节点，其它节点必有两个子节点
- 完全二叉树：最后一层节点除外其他层节点都是满的，且最后一层节点从左向右集中分布（左边节点中间没有空节点）
- 二叉查找树（二分搜索树，BST）
  - 性质：每个节点左子节点值小于等于它的值，右子节点值大于等于它自身的值
  - 优点：最大查找次数为树的深度
  - 缺点：当插入节点都在一边时，就会变成类似线性结构，导致树结构不平衡，影响查找性能
- 遍历二叉树的方法
  - 深度遍历：先序遍历、中序遍历、后序遍历
  - 广度遍历：按层级遍历
- [二叉树图例](https://camo.githubusercontent.com/38340edffe661998f395184c2ac1578aea636788/68747470733a2f2f75706c6f61642e77696b696d656469612e6f72672f77696b6970656469612f636f6d6d6f6e732f662f66372f42696e6172795f747265652e737667)
- 平衡二叉树：一棵空树或它的左右两个子树的高度差的绝对值不超过1，并且左右两个子树都是平衡二叉树
  - 实现：AVL 树、红黑树、替罪羊树、Treap、伸展树等等
  - AVL树：时间复杂度 O(logN)，解决了 BST 的最差情况的复杂度（链表）
    - [AVL旋转规则](https://upload.wikimedia.org/wikipedia/commons/c/c7/Tree_Rebalancing.png)
  - 红黑树（平衡二叉 B 树）：
    - 性质：
      - 节点是红色或黑色；
      - 根节点是黑色；
      - 每个叶子节点是黑色（null 节点）；
      - 每个红色节点的两个子节点都是黑色（每个叶子节点到根的所有路径上不会有两个连续的红色节点）；
      - 任一节点到其叶子节点的所有路径都包含相同数目的黑色节点；
    - 方法：
      - 变色；
      - 旋转（左旋转和右旋转），如图（[图来自掘金文章](https://juejin.im/post/5a27c6946fb9a04509096248)）：；
      - <img src="https://user-gold-cdn.xitu.io/2017/12/6/1602b60230926ead?imageView2/0/w/1280/h/960/format/webp/ignore-error/1" alt="左旋转">
      - <img src="https://user-gold-cdn.xitu.io/2017/12/6/1602b6024ce2b0c4?imageView2/0/w/1280/h/960/format/webp/ignore-error/1" alt="右旋转">
    - 应用：如 JDK 中的类 TreeMap 和 TreeSet，Java8 中的 HashMap；
- trie（前缀树或字典树）：用于保存关联数组
  - 特点：根节点为空不存字符；每个路径存放一个字符；根节点到任意一个节点，经过路径字符合成的值为节点值
- 堆：利用完全二叉树结构来维护的一种数据结构，堆又分为大根堆（每个二叉树中父节点的值最大）和小根堆（每个二叉树中父节点的值最小）

# 哈希表
- 一种键 - 索引 - 数据表的数据结构，数据通过键一级键和索引的关系找到对应索引位置的数据表，从而找到数据

# 图
- 一种非线性结构、多对多节点关系的数据结构，图也分为有向图与无向图
