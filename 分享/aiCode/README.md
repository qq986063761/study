AI 优势总结
  快（搜索快、响应快），才能提交效率；

Cursor

特点：
  多文件上下文
  网站上下文
  图片识别
  先进推理模型

Tab
  快速生成代码段落（
    比如想实现一个小效果；
    生成中英文翻译；
  ）
  
快捷键
  ctrl + k 内联编辑（
    代码区，弹出局部 Chat；
    终端区，弹出局部 Chat；
  ）
  ctrl + l 弹出 Chat

Chat
  Agent：代理模式，根据你的需求感知整个项目，AI自动修改、添加文件
  Ask：提问模式，只给回答，不直接修改文件
  Manual：手动模式，你自己知道要修改什么文件，只修改指定文件

@引入
  @Files&Folders：引入文件、文件夹作为给 ai 的上下文
  @Rules：可复用的用于统一 ai 行为的上下文，按 cursor 定义的规则文件格式，会有特殊的可编辑内容
  @Code：选择指定行数代码添加到 chat 中当做上下文
  @Docs：添加技术文档作为上下文
  @git：授权 git 提交记录后，用来作为上下文分析变动和问题
  @web：开启网络搜索，ai 会从网络上找相关资料

其他 ai code 工具（贵）
  claude code（https://www.anthropic.com/claude-code）
  augment code（https://www.augmentcode.com/）


提问过程：

App.vue
帮我实现如下功能，使用中文回答我：
1、优先使用 common.mdc 规则中的scss变量；
2、左右布局，左边菜单，右边内容区；
3、菜单不用 element 组件，实现一个炫酷菜单效果，要包含css3新特性；切换菜单后右边的内容区，也需要切换动画效果；

sta.vue
帮我实现如下功能，使用中文回答我：
1、优先使用 common.mdc 规则中的scss变量；
2、左右两栏布局，瀑布流；
3、用饼图、柱状图、折线图分别实现我们国家各省的平均温度值统计；

App.vue
@git 帮我分析一下这次提交记录和我当前文件代码的区别

atWeb.vue
@web @doc three.js 帮我用 three.js 实现一个城市的街景效果吧