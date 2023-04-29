# 资源
- [github上start2w+的文章](https://github.com/trekhleb/javascript-algorithms/blob/master/README.zh-CN.md)

# 二进制
- 十进制 --> 二进制：整数部分用短除法除2取余，倒序排列0和1；小数部分乘2取个位数顺序排列，直到乘2后没有小数位

# 位运算

- 左移：10 << 1：10 的二进制数是 1010，每个位向左移则是 10100，所以是 20
- 右移：10 >> 1：二进制 1010，每个位向右移则是 101，所以是 5
- 按位与：8 & 7：1000 & 111，对应每个位都是 1 最终结果位才是 1，所以结果是 0000，十进制是 0
- 按位或：8 | 7：1000 | 111，对应每个位只要存在一个是 1 则结果位是 1，所以结果是 1111，十进制是 15
- 按位异或：8 ^ 8：1000 ^ 1000，对应每个位不同结果位才是 1，所以结果是 0000，十进制是 0

# 阶乘
- 5! = 5 * 4 * 3 * 2 * 1 = 120
```js
  function factorial(num, total = 1) {
    if (num == 1) return total
    return factorial(num - 1, num * total)
  }
```

# 斐波拉契数列
- 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, ...
```js
  function fibonacci(num, b1 = 1, b2 = 1) {
    if (num <= 1) return b1
    return fibonacci(num - 1, b2, b1 + b2)
  }
```

# 是否是素数
- 只能被 1 和本身整除的数
```js
  function isPrimeNum(number) {
    // 是否是整数，是否小于1
    if (number % 1 !== 0 || number <= 1) return false
    // 2,3是素数
    if (number <= 3) return true
    // 能被2整除则不是
    if (number % 2 === 0) return false
    // 开平方
    const sqrt = Math.sqrt(number)
    // 从 3 开始，每次除以 i 能整除说明不是素数 
    for (let i = 3; i <= sqrt; i += 2) {
      if (number % i === 0) return false
    }
    return true
  }
```

# 最大公约数
- 所有能同时被两个整数整除的最大的除数
```js
  function getGCD(num1, num2) {
    const a = Math.abs(num1)
    const b = Math.abs(num2)

    if (a === 0 && b === 0) return null
    if (a === 0 || b === 0) return a || b

    // 相对大的模相对小的，如果能整除（比如4和8），则递归时会存在一方为0，直接返回另一方
    // 如果有余数，说明不能直接整除（比如4和6），则递归时大的那方传入余数，继续递归，直到一方能整除另一方
    if (a > b) return getGCD(a % b, b)

    return getGCD(b % a, a)
  }
```

# 最小公倍数
- 两个或多个整数公有的倍数中最小的那个倍数
```js
  function getLCM(num1, num2) {
    if (num1 === 0 && num2 === 0) return
    return Math.abs(num1 * num2) / getGCD(num1, num2)
  }
```

# 查找

# 二分查找
- 对有序数组进行查找
- [图例](https://camo.githubusercontent.com/b4fcd9ad8f7402d3eff24bef5d2cb8480ecbd448/68747470733a2f2f75706c6f61642e77696b696d656469612e6f72672f77696b6970656469612f636f6d6d6f6e732f382f38332f42696e6172795f5365617263685f446570696374696f6e2e737667)
```js
  function binarySearch(array, value) {
    const comparator = new Comparator(comparatorCallback);

    let startIndex = 0;
    let endIndex = array.length - 1;

    while (startIndex <= endIndex) {
      const middleIndex = startIndex + Math.floor((endIndex - startIndex) / 2);
      // 如果中间索引是查找值，则直接返回索引
      if (array[middleIndex] === value) return middleIndex;
      // 如果中间索引小于查找值，则查找的开始索引设置为中间索引的后一位
      if (array[middleIndex] < value)) {
        startIndex = middleIndex + 1;
      } else {
        // 否则将结束索引设置为中间索引的前一位
        endIndex = middleIndex - 1;
      }
    }

    return -1;
  }
```

# 排序

# 冒泡排序
# 选择排序
# 插入排序

# 堆排序
```js
  function heapSort(arr) {
    const sortedArr = [];
    // MinHeap采用数据结构中的堆的案例demo
    const minHeap = new MinHeap(arr);
    // 如果堆中不是空则获取最小堆顶元素
    while (minHeap.heap.length) {
      const nextMinElement = minHeap.popTop();
      sortedArr.push(nextMinElement);
    }

    return sortedArr;
  }
```

# 归并排序
- [图例](https://camo.githubusercontent.com/64ba2bcbd5c11779657e40a1d03d0ea691f6fa57/68747470733a2f2f75706c6f61642e77696b696d656469612e6f72672f77696b6970656469612f636f6d6d6f6e732f632f63632f4d657267652d736f72742d6578616d706c652d33303070782e676966)
```js
  function mergeSort(array, left, right) {
    // 左右索引相同说明已经只有一个数
    if (left === right) return;
    // left + (right - left) / 2 比 (left + right) / 2 更安全，不会溢出，除以 2 采用位运算更高效
    let mid = parseInt(left + ((right - left) >> 1));
    // 平分数组继续归并排序
    mergeSort(array, left, mid);
    mergeSort(array, mid + 1, right);

    let help = [];
    let i = 0;
    let p1 = left;
    let p2 = mid + 1;
    // 将归并返回的两段数组，同步比较按从小到大的顺序放入新数组中
    while (p1 <= mid && p2 <= right) {
      help[i++] = array[p1] < array[p2] ? array[p1++] : array[p2++];
    }
    // 将上面未完成的数据依次追加到新数组中
    while (p1 <= mid) {
      help[i++] = array[p1++];
    }
    while (p2 <= right) {
      help[i++] = array[p2++];
    }
    for (let i = 0; i < help.length; i++) {
      array[left + i] = help[i];
    }
    return array
  }
```

# 快速排序

- [图例](https://camo.githubusercontent.com/2499d89bbb30337a5d2d7770cc034b4b71fbfdc6/68747470733a2f2f75706c6f61642e77696b696d656469612e6f72672f77696b6970656469612f636f6d6d6f6e732f362f36612f536f7274696e675f717569636b736f72745f616e696d2e676966)

```js
  function quickSort (array) {
    if (array.length <= 1) return array;

    const leftArray = [];
    const rightArray = [];

    // 随机提取中间值
    const pivotValue = array.shift();
    const centerArray = [pivotValue];

    while (array.length) {
      const curValue = array.shift();

      if (curValue === pivotValue) {
        centerArray.push(curValue);
      } else if (curValue < pivotValue) {
        leftArray.push(curValue);
      } else {
        rightArray.push(curValue);
      }
    }

    const leftArraySorted = quickSort(leftArray);
    const rightArraySorted = quickSort(rightArray);

    return leftArraySorted.concat(centerArray, rightArraySorted);
  }
```

# 希尔排序

- [图例](https://camo.githubusercontent.com/e513df288e0848b06be6aaddd915b49045243985/68747470733a2f2f7777772e7475746f7269616c73706f696e742e636f6d2f646174615f737472756374757265735f616c676f726974686d732f696d616765732f7368656c6c5f736f72745f6761705f342e6a7067)

```js
  function shellSort (array) {
    // 定义对比值的索引距离差
    let gap = Math.floor(array.length / 2);

    while (gap > 0) {
      for (let i = 0; i < (array.length - gap); i++) {
        let currentIndex = i;
        let gapShiftedIndex = i + gap;

        while (currentIndex >= 0) {
          if (array[gapShiftedIndex] < array[currentIndex]) {
            [array[gapShiftedIndex], array[currentIndex]] = [array[currentIndex], array[gapShiftedIndex]];
          }

          gapShiftedIndex = currentIndex;
          currentIndex -= gap;
        }
      }

      // 将索引比较间距缩小后再次遍历排序
      gap = Math.floor(gap / 2);
    }

    return array;
  }
```
