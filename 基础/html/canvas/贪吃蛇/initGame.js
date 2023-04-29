// 全局属性
let isStart = false
let initTimer = null
let gameTimer = null

// 蛇属性
let snakeItemSize = 40
let snake = []
let snakeStep = 5
let food = null

// 初始化游戏
function initGame() {
  initEvents()
  drawTitle()

  isStart = false
  clearInterval(gameTimer)

  snake = []
  food = null
  for (let index = 0; index < 15; index++) {
    // 因为蛇 item 是圆，所以这里要多加一个半径
    snake.push({
      x: index * snakeItemSize + snakeItemSize,
      y: snakeItemSize,
      dir: 'right'
    })
  }

  // 绘制开始提示
  function drawStartBtn() {
    context.save()
    
    let fontSize = 40
    let text2 = '左右上下操作，空格键暂停，没别的操作了555'
    context.font = `bold ${fontSize}px Arial`
    context.fillText('按空格键开始游戏', (canvas.width - fontSize * 8) / 2, (canvas.height - fontSize) / 2 + 60)
    context.fillText(text2, (canvas.width - fontSize * text2.length) / 2, (canvas.height - fontSize) / 2 + 160)

    context.restore()
  }
  
  // 绘制标题
  function drawTitle() {
    let title = '贪吃蛇'
    
    let p = [[0, 'deeppink'], [0.25, 'white'], [0.5, 'deeppink'], [0.75, 'white']]
    let step = 0.003
    
    // 渐变动画
    clearInterval(initTimer)
    initTimer = setInterval(() => {
      context.clearRect(0, 0, canvas.width, canvas.height)
      
      // 这里要先保存一下当前绘画状态用于后面 restore 恢复之前的状态，否则下面的改变会影响标题样式
      context.save()
      
      let fontSize = 180
      context.font = `bold ${fontSize}px Arial`
      context.lineWidth = 6
      context.shadowColor = 'gray'
      context.shadowBlur = 15

      // 创建线性渐变色（xstart, ystart, xend, yend）
      let lgrd = context.createLinearGradient(0, 0, canvas.width, canvas.height)
      
      // 追加渐变色断点（stop，color）
      lgrd.addColorStop(0, p[0][1])
      for (let index = 0; index < p.length; index++) {
        lgrd.addColorStop(p[index][0], p[index][1])
      }
      lgrd.addColorStop(1, p[p.length - 1][1])

      context.strokeStyle = lgrd
      context.strokeText(title, (canvas.width - fontSize * 3) / 2, (canvas.height - fontSize) / 2)

      for (let index = 0; index < p.length; index++) {
        p[index][0] += step
      }

      if (p[p.length - 1][0] > 1) {
        p[p.length - 1][0] = 0
        p.unshift(p.pop())
      }

      context.restore()

      drawStartBtn()
      drawSnake()
    }, 1000 / 60)
  }
}

// 初始化事件
function initEvents() {
  document.onkeydown = function (event) {
    let head = snake[snake.length - 1]

    switch (event.keyCode) {
      case 32:
        // 空格
        
        // 如果没开始，则开始游戏，如果已经开始了，则是暂停
        if (isStart) {
          if (gameTimer) {
            clearInterval(gameTimer)
            gameTimer = null
          } else {
            gameTimer = setInterval(update, 1000 / 60) 
          }
        } else {
          isStart = true
          clearInterval(initTimer)
          gameTimer = setInterval(update, 1000 / 60)
        }
        break;

      case 37:
        // 左，避免直接反方向切换
        if (isStart && head.dir !== 'right') {
          head.dir = 'left'
        }
        break;

      case 38:
        // 上
        if (isStart && head.dir !== 'down') {
          head.dir = 'up'
        }
        
        break;

      case 39:
        // 右
        if (isStart && head.dir !== 'left') {
          head.dir = 'right'
        }
        
        break;

      case 40:
        // 下
        if (isStart && head.dir !== 'up') {
          head.dir = 'down'
        }

        break;
    
      default:
        break;
    }
  }

  // 不断更新游戏状态
  function update () {
    context.clearRect(0, 0, canvas.width, canvas.height)

    // 不断的画蛇
    drawSnake()
    
    // 更新食物
    drawFood()

    // 画墙
    context.save()
    context.lineWidth = snakeItemSize / 2
    context.strokeStyle = '#795548'
    context.strokeRect(0, 0, canvas.width, canvas.height)
    context.restore()
  }
}

// 绘制开始界面的蛇
function drawSnake() {
  context.save()
  let head = snake[snake.length - 1]

  context.fillStyle = '#666'
  for (let index = 0; index < snake.length; index++) {
    const item = snake[index]

    if (isStart && item.nextChangeDirInfo) {
      let isChangeDir = false
      switch (item.dir) {
        case 'left':
          isChangeDir = item.x <= item.nextChangeDirInfo.x
          break;

        case 'right':
          isChangeDir = item.x >= item.nextChangeDirInfo.x
          break;

        case 'up':
          isChangeDir = item.y <= item.nextChangeDirInfo.y
          break;

        case 'down':
          isChangeDir = item.y >= item.nextChangeDirInfo.y
        
          break;
      
        default:
          break;
      }
      if (isChangeDir) {
        item.dir = item.nextChangeDirInfo.dir
        item.nextChangeDirInfo = null
      }
    }
    
    context.beginPath()
    context.arc(item.x, item.y, snakeItemSize / 2, 0, 2 * Math.PI)
    context.closePath()
    context.fill()
    
    switch (item.dir) {
      case 'right':
        if (item.x >= canvas.width - snakeItemSize / 2) {
          // 只有没开始的时候才自动改变方向，否则就挂了
          if (!isStart) {
            item.x = canvas.width - snakeItemSize
            item.dir = 'down'
          } else {
            gameOver()
          }
        }
        item.x += snakeStep
        break;

      case 'down':
        if (item.y >= canvas.height - snakeItemSize / 2) {
          if (!isStart) {
            item.y = canvas.height - snakeItemSize
            item.dir = 'left'
          } else {
            gameOver()
          }
        }
        item.y += snakeStep
        break;

      case 'left':
        if (item.x <= snakeItemSize / 2) {
          if (!isStart) {
            item.x = snakeItemSize
            item.dir = 'up'
          } else {
            gameOver()
          }
        }
        item.x -= snakeStep
        break;

      case 'up':
        if (item.y <= snakeItemSize / 2) {
          if (!isStart) {
            item.y = snakeItemSize
            item.dir = 'right'
          } else {
            gameOver()
          }
        }
        item.y -= snakeStep
        break;
    
      default:
        break;
    }

    // 如果已经开始游戏了，则判断每个蛇 item 的方向改变
    if (isStart) {
      let nextItem = snake[index + 1]
      if (nextItem && nextItem.dir !== item.dir && !item.nextChangeDirInfo) {
        item.nextChangeDirInfo = {
          x: nextItem.x,
          y: nextItem.y,
          dir: nextItem.dir
        }
      }
    }
  }
  
  // 画眼睛
  context.fillStyle = 'white'
  context.beginPath()
  context.arc(head.x, head.y, snakeItemSize / 4, 0, 2 * Math.PI)
  context.closePath()
  context.fill()

  context.fillStyle = 'black'
  context.beginPath()
  context.arc(head.x, head.y, snakeItemSize / 8, 0, 2 * Math.PI)
  context.closePath()
  context.fill()

  // 判断是否吃到了食物
  if (isStart 
    && food 
    && head.x > food.x - snakeItemSize / 2 
    && head.x < food.x + snakeItemSize / 2
    && head.y > food.y - snakeItemSize / 2
    && head.y < food.y + snakeItemSize / 2) {
    food = null
    // 蛇变长
    let tail = snake[0]
    snake.unshift({
      x: ['left', 'right'].includes(tail.dir) ? ('left' === tail.dir ? (tail.x + snakeItemSize) : (tail.x - snakeItemSize)) : tail.x,
      y: ['up', 'down'].includes(tail.dir) ? ('up' === tail.dir ? (tail.y + snakeItemSize) : (tail.y - snakeItemSize)) : tail.y,
      dir: tail.dir
    })
  }

  context.restore()
}

// 画食物
function drawFood() {
  // 避免重复出现食物

  // 食物的随机出现位置
  let x = food ? food.x : (canvas.width - snakeItemSize) * Math.random()
  let y = food ? food.y : (canvas.height - snakeItemSize) * Math.random()
  if (x < snakeItemSize) x = snakeItemSize
  if (y < snakeItemSize) y = snakeItemSize

  food = {
    x,
    y
  }

  context.save()

  context.fillStyle = 'red'
  context.beginPath()
  context.arc(x, y, snakeItemSize / 2, 0, 2 * Math.PI)
  context.closePath()
  context.fill()
   
  context.restore()
}

// 挂了
function gameOver() {
  clearInterval(gameTimer)

  alert('你挂了')
  initGame()
}