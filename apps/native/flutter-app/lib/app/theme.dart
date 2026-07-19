import 'package:flutter/material.dart';

/// 集中定义应用的 Material 主题，避免页面自行维护全局样式。
abstract final class AppTheme {
  static final light = ThemeData(
    colorSchemeSeed: Colors.indigo,
    useMaterial3: true,
    brightness: Brightness.light,
  );

  static final dark = ThemeData(
    colorSchemeSeed: Colors.indigo,
    useMaterial3: true,
    brightness: Brightness.dark,
  );
}

/// 管理全局主题模式，默认跟随操作系统设置。
class ThemeModeProvider extends ChangeNotifier {
  ThemeMode _mode = ThemeMode.system;

  ThemeMode get mode => _mode;

  /// 在明暗主题间切换；系统模式下首次切换会进入暗色模式。
  void toggle() {
    _mode = switch (_mode) {
      ThemeMode.light => ThemeMode.dark,
      ThemeMode.dark => ThemeMode.light,
      ThemeMode.system => ThemeMode.dark,
    };
    notifyListeners();
  }

  /// 恢复为跟随操作系统的主题模式。
  void useSystem() {
    _mode = ThemeMode.system;
    notifyListeners();
  }
}
