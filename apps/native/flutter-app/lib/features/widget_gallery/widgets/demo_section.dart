import 'package:flutter/material.dart';

/// 为单组控件示例提供统一的标题、间距和分隔线。
class DemoSection extends StatelessWidget {
  const DemoSection({super.key, required this.title, required this.child});

  final String title;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text(title, style: Theme.of(context).textTheme.titleMedium),
          const SizedBox(height: 12),
          child,
          const SizedBox(height: 12),
          const Divider(height: 1),
        ],
      ),
    );
  }
}

/// 控件示例页的通用可滚动容器。
class DemoPage extends StatelessWidget {
  const DemoPage({super.key, required this.children});

  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.fromLTRB(16, 4, 16, 32),
      children: children,
    );
  }
}
