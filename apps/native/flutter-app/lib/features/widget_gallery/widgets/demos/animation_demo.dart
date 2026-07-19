import 'package:flutter/material.dart';

import 'package:flutter_app_demo/features/widget_gallery/widgets/demo_section.dart';

/// 展示 Flutter 隐式动画控件及状态切换效果。
class AnimationDemo extends StatefulWidget {
  const AnimationDemo({super.key});

  @override
  State<AnimationDemo> createState() => _AnimationDemoState();
}

class _AnimationDemoState extends State<AnimationDemo> {
  // 一个状态同时驱动尺寸、位置、透明度和补间动画，便于对比效果。
  bool _changed = false;
  int _count = 0;

  @override
  Widget build(BuildContext context) {
    return DemoPage(
      children: [
        DemoSection(
          title: 'AnimatedContainer / AnimatedAlign',
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              AnimatedContainer(
                duration: const Duration(milliseconds: 500),
                curve: Curves.easeInOut,
                width: _changed ? 180 : 80,
                height: 80,
                decoration: BoxDecoration(
                  color: _changed ? Colors.teal : Colors.amber,
                  borderRadius: BorderRadius.circular(_changed ? 8 : 40),
                ),
              ),
              const SizedBox(height: 12),
              SizedBox(
                height: 70,
                child: AnimatedAlign(
                  duration: const Duration(milliseconds: 500),
                  alignment: _changed
                      ? Alignment.centerRight
                      : Alignment.centerLeft,
                  child: const Icon(Icons.circle, size: 32),
                ),
              ),
            ],
          ),
        ),
        DemoSection(
          title: 'AnimatedOpacity / AnimatedCrossFade',
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              AnimatedOpacity(
                opacity: _changed ? 0.25 : 1,
                duration: const Duration(milliseconds: 400),
                child: const FlutterLogo(size: 60),
              ),
              AnimatedCrossFade(
                duration: const Duration(milliseconds: 400),
                crossFadeState: _changed
                    ? CrossFadeState.showSecond
                    : CrossFadeState.showFirst,
                firstChild: const Text('第一种状态'),
                secondChild: const Text(
                  '第二种状态',
                  style: TextStyle(fontSize: 24),
                ),
              ),
            ],
          ),
        ),
        DemoSection(
          title: 'AnimatedSwitcher',
          child: Row(
            children: [
              AnimatedSwitcher(
                duration: const Duration(milliseconds: 300),
                transitionBuilder: (child, animation) =>
                    ScaleTransition(scale: animation, child: child),
                child: Text(
                  '$_count',
                  // Key 变化后 AnimatedSwitcher 才会把文本识别为新子组件。
                  key: ValueKey(_count),
                  style: Theme.of(context).textTheme.displaySmall,
                ),
              ),
              const SizedBox(width: 20),
              IconButton.filled(
                tooltip: '增加',
                onPressed: () => setState(() => _count += 1),
                icon: const Icon(Icons.add),
              ),
            ],
          ),
        ),
        DemoSection(
          title: 'TweenAnimationBuilder',
          child: TweenAnimationBuilder<double>(
            tween: Tween(begin: 0, end: _changed ? 1 : 0.25),
            duration: const Duration(milliseconds: 700),
            builder: (context, value, child) =>
                LinearProgressIndicator(value: value),
          ),
        ),
        FilledButton.icon(
          onPressed: () => setState(() => _changed = !_changed),
          icon: const Icon(Icons.play_arrow),
          label: const Text('切换动画状态'),
        ),
      ],
    );
  }
}
