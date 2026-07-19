# Flutter 常用命令

官方文档：https://docs.flutter.dev/reference/flutter-cli

## 版本与环境

```bash
# Flutter 版本
flutter --version

# 环境体检（SDK、Android、Xcode、设备、网络等）
flutter doctor
flutter doctor -v          # 详细输出
flutter doctor --android-licenses   # 接受 Android 许可

# Dart 版本（随 Flutter 自带）
dart --version

# 查看当前 Flutter 通道（stable / beta / master）
flutter channel
flutter channel stable     # 切换到 stable
flutter upgrade            # 升级 Flutter SDK
flutter downgrade          # 降级到上一个版本
```

## 项目创建与管理

```bash
# 创建项目
flutter create my_app
flutter create --org com.example my_app
flutter create --platforms=android,ios,web,windows,macos,linux my_app
flutter create --template=package my_package   # 纯 Dart 包
flutter create --template=plugin my_plugin     # 插件

# 给已有项目补平台目录
flutter create --platforms=web,windows .

# 清理构建缓存
flutter clean
flutter pub get            # 重新拉取依赖（clean 后常用）
```

## 依赖（pub）

```bash
flutter pub get            # 安装依赖
flutter pub upgrade        # 升级依赖（按约束范围）
flutter pub upgrade --major-versions   # 可升 major
flutter pub outdated       # 查看可升级依赖
flutter pub add http       # 添加依赖
flutter pub add dev:mockito   # 添加 dev 依赖
flutter pub remove http    # 移除依赖
flutter pub publish        # 发布到 pub.dev
dart pub global activate fvm   # 全局激活 CLI 工具
```

## 运行与调试

```bash
# 查看已连接设备
flutter devices
flutter emulators
flutter emulators --launch <emulator_id>

# 运行
flutter run
flutter run -d chrome              # Web
flutter run -d windows             # Windows
flutter run -d <device_id>         # 指定设备
flutter run --release              # Release 模式
flutter run --profile              # Profile 模式（性能分析）
flutter run --debug                # Debug（默认）

# 热重载 / 热重启（运行中终端）
# r  热重载
# R  热重启
# q  退出
# h  帮助

# 指定入口 / flavor
flutter run -t lib/main_dev.dart
flutter run --flavor production
```

## 构建

```bash
# Android
flutter build apk                  # 通用 APK
flutter build apk --split-per-abi  # 按 ABI 拆分
flutter build appbundle            # AAB（上架 Google Play）
flutter build apk --release

# iOS（需 macOS + Xcode）
flutter build ios
flutter build ipa

# 桌面
flutter build windows
flutter build macos
flutter build linux

# Web
flutter build web
flutter build web --release
flutter build web --web-renderer canvaskit   # 或 html

# 查看构建产物大小等
flutter build apk --analyze-size
```

## 测试

```bash
flutter test                       # 单元 / Widget 测试
flutter test test/widget_test.dart # 指定文件
flutter test --coverage            # 生成覆盖率
flutter drive                      # 集成测试（需配置）
```

## 代码分析与格式化

```bash
flutter analyze                    # 静态分析
dart format .                      # 格式化当前目录
dart format lib test
dart fix --dry-run                 # 预览可自动修复项
dart fix --apply                   # 应用自动修复
```

## 日志与调试信息

```bash
flutter logs                       # 设备日志
flutter attach                     # 附着到已运行的应用
flutter screenshot                 # 截图
flutter symbolize -i <stack> -d <symbols>   # 符号化崩溃栈
```

## 配置与其他

```bash
# 查看 / 修改配置
flutter config
flutter config --list
flutter config --enable-web
flutter config --enable-windows-desktop
flutter config --enable-macos-desktop
flutter config --enable-linux-desktop
flutter config --no-analytics      # 关闭分析

# 缓存
flutter precache                   # 预下载各平台工具链
flutter precache --android
flutter pub cache clean            # 清理 pub 缓存（慎用）

# 包与资源
flutter pub run build_runner build
flutter pub run build_runner watch
dart run build_runner build --delete-conflicting-outputs

# 生成启动图标等（需插件，示例）
# dart run flutter_launcher_icons
```

## 常用组合速查

| 场景 | 命令 |
|------|------|
| 装完 SDK 先检查 | `flutter doctor -v` |
| 看版本 | `flutter --version` |
| 新建项目 | `flutter create my_app` |
| 装依赖 | `flutter pub get` |
| 真机/模拟器跑 | `flutter devices` → `flutter run` |
| 清缓存重来 | `flutter clean && flutter pub get` |
| 打 Android 包 | `flutter build apk --release` |
| 打 Play 上架包 | `flutter build appbundle` |
| 静态检查 | `flutter analyze` |
| 跑测试 | `flutter test` |
| 升级 SDK | `flutter upgrade` |

## 备注

- `flutter` 命令底层会调用同目录的 `dart`；日常用 `flutter pub *` 即可，与 `dart pub *` 多数场景等价。
- Windows 开发 Android 需装 Android Studio / SDK；iOS 只能在 macOS 上构建。
- 多版本管理可用 [FVM](https://fvm.app/)：`fvm install stable`、`fvm use stable`、`fvm flutter run`。
