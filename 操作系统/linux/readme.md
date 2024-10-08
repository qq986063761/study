# 资源
- [linux内核官网](https://www.kernel.org/)
- [虚拟机vmware](https://www.vmware.com/cn.html)
- [Parallels Desktop](https://www.parallels.cn/products/desktop/welcome/)

# 简介

# 开源软件
- 概念：开放源代码的软件，下载下来的就是源代码；
- 特点：使用自由（通常免费）、研究自由（可获取源代码）、散步改良自由（可修改后自由传播和销售）；

# 应用范围
- 基于linux的企业服务器；
- 嵌入式应用（安卓系统等等）；

# Linux 和 Windows
- Linux严格区分大小写；
- Linux中所有内容以文件形式保存，包括硬件；
- Linux没有扩展名，但是 linux 中通常约定的扩展名类型：
  - 压缩包：*.gz、*.bz2、*.tar.bz2、*.tgz等；
  - 二进制软件包：*.rpm；
  - 网页文件：*.html、*.php；
  - 脚本文件：*.sh；
  - 配置文件：*.conf；
- windows中的程序，不能直接在 linux 中安装和运行；

# 字符界面的优势
- 占用系统资源更少；
- 减少出错、被攻击的可能性（因为运行过程少）；

# 分区
- 格式化目的：规范化分区成块（使写入数据时，按规律写入），顺便清空数据；
- 对于一个硬盘的分区需要注意：
  - 主分区和扩展分区总数不能超过4个
  - 扩展分区最多只能有一个
  - 扩展分区不能直接存取数据
- 分区流程：
  - fdisk -l 查看当前所有分区表，获取当前未被分区的磁盘硬件信息
  - MBR分区（主分区不超过4个；单个分区容量最大2TB）：
    - 进入分区流程：fdisk /dev/sdb，然后查看帮助
    - 帮助模式下输入 n 添加分区：可以选择 p 主分区和 e 扩展分区，我们选择 p，则对分区进行编号（1-4）
    - 输入分区的开始结束分区的扇区范围（结束范围可指定 +3000M 指定分区大小），然后成功分区（逻辑分区在扩展分区内部）
    - 分区合理之后输入 w 将分区写入到磁盘真正完成分区
  - GPT分区（主分区个数几乎无限制（最多128个主分区）；单个分区容量几乎无限制（最多18EB=18432PB=18874368TB））：
    - 执行 parted 命令启动 GPT 分区，利用 help 文档
    - select /dev/sdb 切换到指定硬盘
    - mklabel gpt 指定分区表类型
    - print all 查看所有指定磁盘的分区信息
    - mkpart 开始交互式（询问式）分区，分区大小默认单位M，分区开始点从1开始可避免4k对齐警告；也可使用命令式分区（例：mkpart test 2000 3000）
    - 对不满的分区可使用 rm 2（分区编号，可用 print 查看）删除
    - unit GB 可指定默认单位分区单位
    - quit 退出
  - 格式化（查看格式化命令）
  - 挂载，在 /etc/fstab 中新增一行配置（/dev/sdb1 /mnt/wanpeng ext4 defaults 0 0），这样重启系统可自动挂载
- 建立 swap（交换）分区：
  - 利用 fdisk /dev/sdb 查看硬盘信息
  - 输入 t 指定一个分区
  - 输入 l 切换成交换分区 id
  - 输入 w 保存
  - 格式化交换分区（mkswap /dev/sdb1）
  - 利用命令启用停用交换分区

# linux系统常见目录和文件
- bin、sbin、usr/bin、usr/sbin：系统命令目录，s开头的是超级用户权限可用
- dev：硬件配置文件
- etc：系统默认配置文件
- root：根权限用户目录
- home：普通用户目录
- lib：linux函数库目录
- mnt：系统挂载目录
- tmp：临时目录
- proc：直接写入内存
- usr：系统软件资源
- var：系统相关文档内容
- ~/.bashrc：用户环境变量配置文件

# 压缩
- linux 常见压缩格式有：.zip、.gz、.bz2、.tar.gz、.tar.bz2

# 操作快捷键
- ctrl + c：强制终止；
- ctrl + l：清除（相当于clear）；
- ctrl + a：光标移动到命令行首；
- ctrl + e：光标移动到命令行尾；
- ctrl + u：光标所在位置清除到命令行首；
- ctrl + z：把命令放到后台执行；
- ctrl + r：在历史命令中搜索；

# 设备
- 键盘：/dev/stdin（文件描述符：0；类型：标准输入）
- 显示器：/dev/stdout（文件描述符：1；类型：标准输出）
- 显示器：/dev/stderr（文件描述符：2；类型：标准错误输出）

# 用户和用户组
- 用户：使用操作系统的人
- 用户组：具有相同系统权限的一组用户
- /etc/group：用户组信息配置
  - 配置信息 sys:x:3:bin,adm 分别对应：组名:组密码占位符:组编号:组中用户名列表
  - root用户的组编号是：0
  - 组编号1-499是系统预留编号。
- /etc/gshadow：当前系统中用户组密码信息
  - 配置信息 root::: 分别对应：组名:组密码（*号表示无密码）:组管理者:组中用户名列表
- /etc/passwd：当前系统中所有用户信息
  - 配置信息 root:x:0:0:root:/root:/bin/bash 分别对应：用户名:密码占位符:用户编号:用户组编号:用户注释信息:用户主目录:shell类型
- /etc/shadow：当前系统中所有用户的密码信息
  - 配置信息 bin:*:15980:0:99999:7::: 分别对应：用户名:密码

# 软件包分类
- 源码包（可通过软件 winscp 或 filezilla 等软件和 linux 进行传输文件）：
  - 优点：开源；自由选择所需功能；编译安装，更适合系统，稳定高效；卸载方便
  - 缺点：安装步骤多，安装容易出错；编译安装过程长；安装报错新手很难解决
  - 安装位置：用户指定位置
  - 安装流程：
    - 下载源码包到linux；
    - 解压源码包，进入解压目录的根目录内，可查看 INSTALL 文件内容了解安装执行流程
    - 执行./configure --prefix=/usr/local/软件名 对软件进行配置和检查（--prefix通常配置此路径为软件安装路径）
    - 执行 make 进行编译（如果报错可执行 make clean 清除之前编译的缓存）
    - 执行 make install 安装软件
- 二进制包（rpm包、系统默认包）：
  - 优点：管理简单（安装、升级、查询、卸载）；安装速度快
  - 缺点：不能看到源码；功能选择不灵活；依赖性强
  - 安装位置：
    配置文件目录：/etc/
    可执行命令目录：/usr/bin/
    程序使用的函数库位置：/usr/lib/
    软件使用手册保存位置：/usr/share/doc/
    帮助文档位置：/usr/share/man/
- 包全名和包名：
  - 包全名：操作的包是没有安装的软件包，使用包全名
  - 包名：操作已经安装的软件包时，使用包名（搜索的是/var/lib/rpm中的数据库）

# 网络配置
- 通用配置流程：
  - 先配置 ip 地址，重启网络服务
  - 再启动网卡：将网卡信息文件中的 ONBOOT 改为 yes，重启网络服务
  - 再修改UUID：将网卡信息文件中的 MAC 地址行删除，然后删除网卡和 Mac 地址绑定文件（rm -rf /etc/udev/rules.d/70-persistent-net.rules），重启系统
  - 设置虚拟机网络连接方式（桥接、NAT等等）
  - 修改桥接网卡（无线连接则选无线网卡，有线连接则选有线网卡）
- 通过命令配置网络：ifconfig eth0 192.168.254.200 netmask 255.255.255.0
- 通过文件配置网络：
  - 网卡信息文件：/etc/sysconfig/network-scripts/ifcfg-eth0
    - DEVICE：网卡设备名（必须和文件名-后的名字一致，如这里都必须是eth0）
    - BOOTPROTO：是否自动获取ip（none、static、dhcp（自动获取，需要 dhcp 服务器存在））
    - HWADDR：MAC地址
    - NM_CONTROLLED：是否可以由Network Manager图形管理工具托管
    - ONBOOT：是否随网络服务启动
    - TYPE：类型（以太网）
    - UUID：唯一识别码
    - IPADDR：ip地址
    - NETMASK：子网掩码
    - GATEWAY：网关
    - DNS1：DNS服务
    - IPV6INIT：是否启用ipv6
    - USERCTL：是否允许非 root 用户控制此网卡
  - 网络配置文件：/etc/sysconfig/network
  - 网络解析配置文件：/etc/resolv.conf
    - nameserver：dns服务地址

# ssh远程管理
- 请求控制远程服务器 ssh root@192.168.0.253
- 回答 yes 获取远程服务器的公钥到本地（公钥作为解锁钥匙）
  - 公钥下载到本机登录用户文件夹的 .ssh 文件夹，内部的 known_hosts 文件记录着访问的ip和公钥
- 输入登录密码，成功登录对方服务器
- 输入 exit 退出远程主机
- Linux远程管理工具：SecureCRT




# 软件安装demo

# GMP、MPFR、MPC安装（https://blog.csdn.net/wuyupei1213434654/article/details/8847932#）
- 下载 GMP 合适版本源码包（https://gmplib.org/）
- 安装 GMP：
  - 解压 GMP 源码包
  - 进入解压目录，执行：./configure --prefix=/usr/local/gmp-6.1.2 检测并指定配置路径
  - 执行 make 编译源码包
  - 执行 make install 安装
- 下载 MPFR 合适版本源码包（https://www.mpfr.org/mpfr-current/#download）
  - 其他流程同上，除进入解压目录，执行：./configure --prefix=/usr/local/mpfr-4.0.2 --with-gmp=/usr/local/gmp-6.1.2（--with指定依赖）
- 下载 MPC 合适版本源码包（http://www.multiprecision.org/mpc/download.html）
  - 其他流程同上，除进入解压目录，执行：./configure --prefix=/usr/local/mpc-1.0.3 --with-gmp=/usr/local/gmp-6.1.2 --with-mpfr=/usr/local/mpfr-4.0.2

# gcc（http://www.hjqjk.com/2017/CentOS-6-5-install-NodeJS.html）
- 下载适合的 gcc 版本源码包（https://ftp.gnu.org/gnu/gcc/）
- 解压 gcc 源码包
- 执行 ./configure --prefix=/usr/local/gcc-8.3.0 --enable-checking=release --enable-languages=c,c++ --disable-multilib 配置和检测
  - 问题：Building GCC requires GMP 4.2+, MPFR 2.4.0+ and MPC 0.8.0+（可在目录下执行 ./contrib/download_prerequisites 尝试自动安装依赖，否则手动安装，安装流程见上面的相关安装流程）
- 执行 make 开始编译
- 执行 make install 开始安装
- 安装完成后开始替换以前的 bin 下的执行文件
  - mv /usr/bin/c++ /usr/bin/c++.bak（备份）
  - ln -s /usr/local/gcc-8.3.0/bin/c++ /usr/bin/c++（创建软链接）
  - mv /usr/bin/g++ /usr/bin/g++.bak
  - ln -s /usr/local/gcc-8.3.0/bin/g++ /usr/bin/g++
  - mv /usr/bin/gcc /usr/bin/gcc.bak 
  - ln -s /usr/local/gcc-8.3.0/bin/gcc /usr/bin/gcc
  - gcc -v：替换完成后可查看 gcc 现在的版本
- 替换动态链接库
  - strings /usr/lib/libstdc++.so.6 | grep GLIBC：查看目前的 gcc 动态链接库
  - cp /usr/local/gcc-8.3.0/lib/libstdc++.so.6.0.25 /usr/lib（复制gcc安装目录中的动态链接库）
  - cd /usr/lib/
  - rm -f ./libstdc++.so.6（移除以前的老旧库）
  - ln -s libstdc++.so.6.0.25 libstdc++.so.6（创建新的动态链接库软链接）

# python2.7
- 下载合适的安装包（https://www.python.org/ftp/python/）
- xz -d Python-2.7.9.tar.xz：解压xz文件
- tar -xvf Python-2.7.9.tar：解压tar文件
- cd Python-2.7.9：进入解压目录
- ./configure --prefix=/usr/local/python2.7（检测配置以及更改配置）
- make && make install：编译并安装
- mv /usr/bin/python /usr/bin/python.bk：备份旧的 python 执行文件
- ln -sf /usr/local/python2.7/bin/python2.7 /usr/bin/python：修改旧的软链接
- ln -sf /usr/local/python2.7/bin/python2.7 /usr/bin/python2.7：修改旧的软链接
- 执行 python 查看版本

# node.js（https://www.cnblogs.com/felixzh/p/5822354.html）
- 快捷安装：
  - 下载 linux 对应系统的已编译版本（https://nodejs.org/dist/）
  - 将 linux 目录放到 /usr/local 目录下
  - 将 node 目录下 bin 目录下的 node、npm、npx 创建软链接到 /usr/bin 下
- 完整安装：
  - 下载 node 源码包（官网下载，利用 ftp 工具传给 linux）
  - 解压 node 源码包（利用命令 tar）
  - 进入解压后的目录，执行 ./configure --prefix=/usr/local/node-9.11.2 调整检测配置
    - 问题：failed to autodetect C++ compiler version (CXX=g++)，可以安装gcc（yum -y install gcc-c++）
    - 问题：C++ compiler too old, need g++ 4.9.4 or clang++ 3.4.2 (CXX=g++)，可以按上面 gcc 安装流程安装新版本 gcc
    - 问题：no python2.7 in (/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin:/root/bin)，可以安装 python（步骤见上面python 安装过程）
    - 问题：Did not find a new enough assembler, install one or build with，
  - 执行 make 编译源码
  - 执行 make install 安装 node



  