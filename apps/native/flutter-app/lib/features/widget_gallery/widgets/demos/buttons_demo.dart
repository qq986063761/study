import 'package:flutter/material.dart';

import 'package:flutter_app_demo/features/widget_gallery/widgets/demo_section.dart';

/// 展示 Material 按钮、分段选择和菜单控件。
class ButtonsDemo extends StatefulWidget {
  const ButtonsDemo({super.key});

  @override
  State<ButtonsDemo> createState() => _ButtonsDemoState();
}

class _ButtonsDemoState extends State<ButtonsDemo> {
  Set<String> _segments = {'day'};
  final List<bool> _toggles = [true, false, false];
  String _lastAction = '尚未点击';

  void _record(String value) => setState(() => _lastAction = value);

  @override
  Widget build(BuildContext context) {
    return DemoPage(
      children: [
        DemoSection(
          title: 'ElevatedButton / FilledButton',
          child: Wrap(
            spacing: 10,
            runSpacing: 10,
            children: [
              ElevatedButton(
                onPressed: () => _record('ElevatedButton'),
                child: const Text('Elevated'),
              ),
              FilledButton(
                onPressed: () => _record('FilledButton'),
                child: const Text('Filled'),
              ),
              FilledButton.tonalIcon(
                onPressed: () => _record('FilledButton.icon'),
                icon: const Icon(Icons.add),
                label: const Text('新增'),
              ),
            ],
          ),
        ),
        DemoSection(
          title: 'OutlinedButton / TextButton / IconButton',
          child: Wrap(
            spacing: 10,
            runSpacing: 10,
            crossAxisAlignment: WrapCrossAlignment.center,
            children: [
              OutlinedButton(
                onPressed: () => _record('OutlinedButton'),
                child: const Text('Outlined'),
              ),
              TextButton(
                onPressed: () => _record('TextButton'),
                child: const Text('Text'),
              ),
              IconButton.filledTonal(
                tooltip: '收藏',
                onPressed: () => _record('IconButton'),
                icon: const Icon(Icons.favorite_outline),
              ),
              const FilledButton(onPressed: null, child: Text('禁用')),
            ],
          ),
        ),
        DemoSection(
          title: 'SegmentedButton',
          child: Align(
            alignment: Alignment.centerLeft,
            child: SegmentedButton<String>(
              segments: const [
                ButtonSegment(
                  value: 'day',
                  label: Text('日'),
                  icon: Icon(Icons.today),
                ),
                ButtonSegment(
                  value: 'week',
                  label: Text('周'),
                  icon: Icon(Icons.date_range),
                ),
                ButtonSegment(
                  value: 'month',
                  label: Text('月'),
                  icon: Icon(Icons.calendar_month),
                ),
              ],
              selected: _segments,
              onSelectionChanged: (value) => setState(() => _segments = value),
            ),
          ),
        ),
        DemoSection(
          title: 'ToggleButtons',
          child: Align(
            alignment: Alignment.centerLeft,
            child: ToggleButtons(
              isSelected: _toggles,
              onPressed: (index) =>
                  setState(() => _toggles[index] = !_toggles[index]),
              children: const [
                Padding(
                  padding: EdgeInsets.all(12),
                  child: Icon(Icons.format_bold),
                ),
                Padding(
                  padding: EdgeInsets.all(12),
                  child: Icon(Icons.format_italic),
                ),
                Padding(
                  padding: EdgeInsets.all(12),
                  child: Icon(Icons.format_underlined),
                ),
              ],
            ),
          ),
        ),
        DemoSection(
          title: 'PopupMenuButton / MenuAnchor',
          child: Wrap(
            spacing: 16,
            crossAxisAlignment: WrapCrossAlignment.center,
            children: [
              PopupMenuButton<String>(
                tooltip: '更多操作',
                onSelected: _record,
                itemBuilder: (context) => const [
                  PopupMenuItem(value: '编辑', child: Text('编辑')),
                  PopupMenuItem(value: '复制', child: Text('复制')),
                  PopupMenuItem(value: '删除', child: Text('删除')),
                ],
              ),
              MenuAnchor(
                menuChildren: [
                  MenuItemButton(
                    onPressed: () => _record('保存'),
                    child: const Text('保存'),
                  ),
                  MenuItemButton(
                    onPressed: () => _record('分享'),
                    child: const Text('分享'),
                  ),
                ],
                // MenuAnchor 需要通过控制器显式切换浮层的打开状态。
                builder: (context, controller, child) => OutlinedButton.icon(
                  onPressed: () => controller.isOpen
                      ? controller.close()
                      : controller.open(),
                  icon: const Icon(Icons.menu),
                  label: const Text('菜单'),
                ),
              ),
            ],
          ),
        ),
        DemoSection(
          title: 'FloatingActionButton',
          child: Align(
            alignment: Alignment.centerLeft,
            child: FloatingActionButton.small(
              heroTag: 'buttons-demo-fab',
              tooltip: '添加',
              onPressed: () => _record('FloatingActionButton'),
              child: const Icon(Icons.add),
            ),
          ),
        ),
        Text('最近操作：$_lastAction'),
      ],
    );
  }
}
