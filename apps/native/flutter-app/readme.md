# Flutter Multi-platform Demo

基于 Flutter 3.44.6 / Dart 3.12.2，使用 Material 3、`go_router`、Provider 和 `http`。工程支持 Android、iOS、Web、Windows、macOS 与 Linux。

## 环境

- Flutter 3.44.6 stable 或兼容的更高稳定版
- Android 构建需 Android Studio / Android SDK
- iOS、macOS 构建需在 macOS 安装 Xcode 与 CocoaPods
- Windows 构建需 Visual Studio 2022 的“使用 C++ 的桌面开发”工作负载
- Linux 构建需 Clang、CMake、Ninja 与 GTK 3 开发库

## 安装与启动

```bash
# 下载并安装 pubspec.yaml 中声明的依赖包
flutter pub get

# 列出当前可用的设备 / 模拟器 / 桌面平台
flutter devices

# 在指定设备上启动并热重载运行应用（将 <device-id> 替换为 flutter devices 输出的 ID）
flutter run -d <device-id>

# 在 安卓 虚拟机中运行
flutter run -d emulator-5554

# 在 Chrome 浏览器中以 Web 模式运行
flutter run -d chrome

# 在 Windows 桌面端运行
flutter run -d windows
```

Android/iOS 真机或模拟器的设备 ID 以 `flutter devices` 输出为准。

## 代码目录

项目采用 Feature-first 目录：应用级能力集中在 `app/`，业务代码按功能聚合在
`features/`，只有跨功能复用的基础能力才进入 `core/` 或 `shared/`。

```text
lib/
├── main.dart
├── app/
│   ├── app.dart                 # 根组件和全局依赖注册
│   ├── router.dart              # 应用路由与导航框架
│   └── theme.dart               # 全局主题和主题状态
├── core/
│   ├── constants/               # 跨功能稳定常量（当前为目录占位说明）
│   ├── network/
│   │   └── api_exception.dart   # 跨功能通用网络异常
│   └── utils/                   # 跨功能纯工具（当前为目录占位说明）
├── features/
    ├── posts/
    │   ├── api/                 # 帖子接口
    │   ├── models/              # 帖子数据模型
    │   ├── pages/               # 帖子页面
    │   └── providers/           # 帖子状态管理
    └── widget_gallery/
        ├── models/              # 示例分类模型和目录
        ├── pages/               # 控件目录与详情页面
        └── widgets/             # 功能内部组件和控件示例
└── shared/
│   └── widgets/                 # 跨功能 Widget（当前为目录占位说明）
```

`core/constants`、`core/utils` 和 `shared/widgets` 当前通过 `README.md` 占位，后续新增内容
必须满足对应目录的复用边界。`test/` 保存单元测试和 Widget 测试。

`android/`、`ios/`、`web/`、`windows/`、`macos/`、`linux/` 主要放各平台工程配置；普通页面和业务逻辑不写在这些目录中。

## 检查与测试

```bash
# 静态分析代码，检查语法错误、类型问题和 lint 规则
flutter analyze

# 运行 test/ 目录下的单元测试与 Widget 测试
flutter test
```

## 打包

```bash
# 构建 Android 可安装的 APK 包（release 模式）
flutter build apk --release

# 构建 Android App Bundle，用于上架 Google Play
flutter build appbundle --release

# 构建 iOS IPA 安装包（仅 macOS，用于 TestFlight / App Store）
flutter build ipa --release

# 构建 Web 静态资源，输出到 build/web
flutter build web --release

# 构建 Windows 桌面可执行程序
flutter build windows --release

# 构建 macOS 桌面应用（仅 macOS）
flutter build macos --release

# 构建 Linux 桌面可执行程序（仅 Linux）
flutter build linux --release
```

产物统一位于 `build/`。移动端正式发布前需配置应用 ID、签名、图标与商店资料。

## 功能

- 首页提供 9 类常用 Flutter / Material / Cupertino 控件的可交互示例
- 控件示例按类别拆分在 `lib/features/widget_gallery/widgets/demos/`，便于单独查看源码
- 从 JSONPlaceholder 加载帖子并展示加载、错误和重试状态
- `ShellRoute` 管理 `/posts` 与 `/posts/:id` 父子路由
- Provider 管理帖子缓存和明暗主题
