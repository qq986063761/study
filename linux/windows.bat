REM 学习文章 https://www.cnblogs.com/xpwi/p/9626959.html

REM 隐藏终端命令显示
@echo off

REM 设置终端标题
title Wan Peng

REM 显示当前日期 如果没有/t 则会提示输入新日期
date/t

REM 输出内容
echo hello world

REM 设置变量
set root=cmd

REM 判断
if not exist dist md dist

REM 跳转目录
cd ./dist

REM &符号：顺序执行
npm run build & (
  REM for：循环，参数 /d：遍历目录，不带参数遍历文件
  for /d %%f in (*) do (
    REM 移动文件
    move %%f ../../../autobuild/dist/%root%/%%f
  )

  REM 强制递归删除目录
  rmdir /s/q dist
)

REM 并行执行其他批处理文件，call：串行执行
start %cmd%

REM 暂停，避免终端直接退出
pause