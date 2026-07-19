import 'package:flutter/material.dart';

import 'package:flutter_app_demo/features/widget_gallery/widgets/demo_section.dart';

/// 展示约束、线性布局、层叠布局等常用布局控件。
class LayoutDemo extends StatelessWidget {
  const LayoutDemo({super.key});

  Widget _box(BuildContext context, String text, {Color? color}) {
    // 统一示例块尺寸，便于直观看出不同布局控件如何分配空间。
    return Container(
      width: 64,
      height: 48,
      alignment: Alignment.center,
      color: color ?? Theme.of(context).colorScheme.primaryContainer,
      child: Text(text),
    );
  }

  @override
  Widget build(BuildContext context) {
    return DemoPage(
      children: [
        DemoSection(
          title: 'Container / Padding / Center / Align',
          child: Container(
            height: 120,
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Theme.of(context).colorScheme.surfaceContainerHighest,
              borderRadius: BorderRadius.circular(8),
            ),
            child: Align(
              alignment: Alignment.bottomRight,
              child: _box(context, 'Align'),
            ),
          ),
        ),
        DemoSection(
          title: 'Row / Expanded / Flexible',
          child: Row(
            children: [
              _box(context, '固定'),
              const SizedBox(width: 8),
              Expanded(child: _box(context, 'Expanded')),
              const SizedBox(width: 8),
              Flexible(child: _box(context, 'Flexible')),
            ],
          ),
        ),
        DemoSection(
          title: 'Column / SizedBox',
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _box(context, '上'),
              const SizedBox(height: 8),
              _box(context, '下'),
            ],
          ),
        ),
        DemoSection(
          title: 'Wrap',
          child: Wrap(
            spacing: 8,
            runSpacing: 8,
            children: List.generate(
              8,
              (index) => Chip(label: Text('项目 ${index + 1}')),
            ),
          ),
        ),
        DemoSection(
          title: 'Stack / Positioned',
          child: SizedBox(
            height: 130,
            child: Stack(
              children: [
                Positioned.fill(
                  child: ColoredBox(
                    color: Theme.of(context).colorScheme.primaryContainer,
                  ),
                ),
                const Positioned(
                  top: 12,
                  left: 12,
                  child: Chip(label: Text('左上')),
                ),
                const Positioned(
                  right: 12,
                  bottom: 12,
                  child: CircleAvatar(child: Icon(Icons.layers_outlined)),
                ),
              ],
            ),
          ),
        ),
        DemoSection(
          title: 'AspectRatio / FractionallySizedBox',
          child: Align(
            alignment: Alignment.centerLeft,
            child: FractionallySizedBox(
              widthFactor: 0.7,
              child: AspectRatio(
                aspectRatio: 16 / 5,
                child: ColoredBox(
                  color: Theme.of(context).colorScheme.secondaryContainer,
                  child: const Center(child: Text('16 : 5')),
                ),
              ),
            ),
          ),
        ),
        DemoSection(
          title: 'ConstrainedBox / FittedBox',
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 260, minHeight: 70),
            child: DecoratedBox(
              decoration: BoxDecoration(
                border: Border.all(
                  color: Theme.of(context).colorScheme.outline,
                ),
              ),
              child: const FittedBox(
                fit: BoxFit.scaleDown,
                child: Padding(
                  padding: EdgeInsets.all(12),
                  child: Text('自动缩放的 FittedBox 文本'),
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }
}
