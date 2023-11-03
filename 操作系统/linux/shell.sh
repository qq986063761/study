#!/bin/bash
# #号是注释，但是第一行不是，第一行表示用 bash shell.sh 执行 shell 文件
# linux命令学习 https://www.linuxcool.com/

# echo 用于输出内容
echo '------脚本开始执行-------'

# 显示当前日期，反引号表示执行系统命令返回结果
echo `date`

# 设置变量
to="./dist"
from="../jquery"

# 条件语句，if -> then -> elif --> then --> else --> fi，
# 每个字符都要用空格隔开，不然会报错

# 文件是否不存在
# -d：判断文件夹
# -f：判断文件
if [ ! -d "$to" ]; then
  mkdir "$to"
fi

# for 循环
for file in `ls $from`
do
  cp -a "$from/$file" "$to/$file"
done

# 执行其他脚本，如果需要文件权限可以先配置权限 chmod 771 FILE，
# fork exec source 都能执行其他脚本但是有区别
# ../test.sh

echo '------脚本执行完毕-------'