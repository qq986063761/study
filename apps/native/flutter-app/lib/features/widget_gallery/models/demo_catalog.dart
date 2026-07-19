import 'package:flutter/material.dart';

/// 控件示例分类在目录页和路由标题中共用的元数据。
class DemoCategory {
  const DemoCategory({
    required this.id,
    required this.title,
    required this.subtitle,
    required this.icon,
  });

  final String id;
  final String title;
  final String subtitle;
  final IconData icon;
}

/// 控件示例目录；分类 ID 同时用作 `/widgets/:category` 路由参数。
const demoCategories = <DemoCategory>[
  DemoCategory(
    id: 'basic',
    title: '基础与展示',
    subtitle: 'Text、Icon、Image、Card、Chip、Badge',
    icon: Icons.widgets_outlined,
  ),
  DemoCategory(
    id: 'layout',
    title: '布局',
    subtitle: 'Row、Column、Wrap、Stack、Expanded、Container',
    icon: Icons.dashboard_outlined,
  ),
  DemoCategory(
    id: 'buttons',
    title: '按钮与菜单',
    subtitle: 'Material 按钮、IconButton、SegmentedButton、Menu',
    icon: Icons.smart_button_outlined,
  ),
  DemoCategory(
    id: 'input',
    title: '输入与选择',
    subtitle: 'TextField、Checkbox、Radio、Switch、Slider、Picker',
    icon: Icons.tune,
  ),
  DemoCategory(
    id: 'feedback',
    title: '反馈与弹层',
    subtitle: 'Progress、SnackBar、Dialog、BottomSheet、Tooltip',
    icon: Icons.notifications_outlined,
  ),
  DemoCategory(
    id: 'scrolling',
    title: '列表与滚动',
    subtitle: 'ListView、GridView、PageView、ExpansionTile',
    icon: Icons.view_list_outlined,
  ),
  DemoCategory(
    id: 'navigation',
    title: '导航',
    subtitle: 'NavigationBar、NavigationRail、TabBar、Drawer',
    icon: Icons.alt_route,
  ),
  DemoCategory(
    id: 'animation',
    title: '动画',
    subtitle: 'AnimatedContainer、AnimatedSwitcher、TweenAnimationBuilder',
    icon: Icons.animation,
  ),
  DemoCategory(
    id: 'cupertino',
    title: 'iOS 风格',
    subtitle: 'CupertinoButton、Switch、Slider、TextField、Picker',
    icon: Icons.phone_iphone,
  ),
];

/// 根据路由中的分类 ID 查找目录项，未匹配时返回 `null`。
DemoCategory? findDemoCategory(String id) {
  for (final category in demoCategories) {
    if (category.id == id) return category;
  }
  return null;
}
