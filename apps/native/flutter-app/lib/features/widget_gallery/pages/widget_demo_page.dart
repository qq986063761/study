import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import 'package:flutter_app_demo/features/widget_gallery/models/demo_catalog.dart';
import 'package:flutter_app_demo/features/widget_gallery/widgets/demos/animation_demo.dart';
import 'package:flutter_app_demo/features/widget_gallery/widgets/demos/basic_demo.dart';
import 'package:flutter_app_demo/features/widget_gallery/widgets/demos/buttons_demo.dart';
import 'package:flutter_app_demo/features/widget_gallery/widgets/demos/cupertino_demo.dart';
import 'package:flutter_app_demo/features/widget_gallery/widgets/demos/feedback_demo.dart';
import 'package:flutter_app_demo/features/widget_gallery/widgets/demos/input_demo.dart';
import 'package:flutter_app_demo/features/widget_gallery/widgets/demos/layout_demo.dart';
import 'package:flutter_app_demo/features/widget_gallery/widgets/demos/navigation_demo.dart';
import 'package:flutter_app_demo/features/widget_gallery/widgets/demos/scrolling_demo.dart';

/// 根据路由中的 [categoryId] 展示对应控件示例。
class WidgetDemoPage extends StatelessWidget {
  const WidgetDemoPage({super.key, required this.categoryId});

  final String categoryId;

  @override
  Widget build(BuildContext context) {
    final category = findDemoCategory(categoryId);
    if (category == null) {
      return const Center(child: Text('未找到该控件分类'));
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(8, 4, 16, 4),
          child: Row(
            children: [
              IconButton(
                tooltip: '返回控件分类',
                onPressed: () => context.go('/widgets'),
                icon: const Icon(Icons.arrow_back),
              ),
              const SizedBox(width: 4),
              Icon(category.icon),
              const SizedBox(width: 10),
              Expanded(
                child: Text(
                  category.title,
                  style: Theme.of(context).textTheme.titleLarge,
                ),
              ),
            ],
          ),
        ),
        Expanded(child: _buildDemo(categoryId)),
      ],
    );
  }

  Widget _buildDemo(String id) {
    // 分类 ID 与具体示例组件的映射集中在此处，保持路由配置简洁。
    return switch (id) {
      'basic' => const BasicDemo(),
      'layout' => const LayoutDemo(),
      'buttons' => const ButtonsDemo(),
      'input' => const InputDemo(),
      'feedback' => const FeedbackDemo(),
      'scrolling' => const ScrollingDemo(),
      'navigation' => const NavigationDemo(),
      'animation' => const AnimationDemo(),
      'cupertino' => const CupertinoDemo(),
      _ => const SizedBox.shrink(),
    };
  }
}
