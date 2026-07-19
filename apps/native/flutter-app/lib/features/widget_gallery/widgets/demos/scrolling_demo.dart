import 'package:flutter/material.dart';

import 'package:flutter_app_demo/features/widget_gallery/widgets/demo_section.dart';

/// 展示列表、网格、分页和可排序滚动控件。
class ScrollingDemo extends StatefulWidget {
  const ScrollingDemo({super.key});

  @override
  State<ScrollingDemo> createState() => _ScrollingDemoState();
}

class _ScrollingDemoState extends State<ScrollingDemo> {
  final _items = List.generate(5, (index) => '可排序项目 ${index + 1}');
  // 小于 1 的 viewportFraction 会露出下一页，提示内容可以横向滑动。
  final _pageController = PageController(viewportFraction: 0.88);

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return DemoPage(
      children: [
        DemoSection(
          title: 'ListView.separated / ListTile',
          child: SizedBox(
            height: 190,
            child: ListView.separated(
              itemCount: 8,
              separatorBuilder: (context, index) => const Divider(height: 1),
              itemBuilder: (context, index) => ListTile(
                leading: CircleAvatar(child: Text('${index + 1}')),
                title: Text('列表项目 ${index + 1}'),
                trailing: const Icon(Icons.chevron_right),
              ),
            ),
          ),
        ),
        DemoSection(
          title: 'GridView.count',
          child: SizedBox(
            height: 220,
            child: GridView.count(
              crossAxisCount: 3,
              crossAxisSpacing: 8,
              mainAxisSpacing: 8,
              children: List.generate(
                9,
                (index) => ColoredBox(
                  color: Theme.of(context).colorScheme.primaryContainer,
                  child: Center(child: Text('${index + 1}')),
                ),
              ),
            ),
          ),
        ),
        DemoSection(
          title: 'PageView',
          child: SizedBox(
            height: 150,
            child: PageView.builder(
              controller: _pageController,
              itemCount: 4,
              itemBuilder: (context, index) => Padding(
                padding: const EdgeInsets.only(right: 10),
                child: ColoredBox(
                  color: index.isEven
                      ? Theme.of(context).colorScheme.secondaryContainer
                      : Theme.of(context).colorScheme.tertiaryContainer,
                  child: Center(
                    child: Text(
                      '第 ${index + 1} 页',
                      style: Theme.of(context).textTheme.titleLarge,
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
        const DemoSection(
          title: 'ExpansionTile',
          child: Column(
            children: [
              ExpansionTile(
                leading: Icon(Icons.folder_outlined),
                title: Text('展开项目'),
                children: [
                  ListTile(title: Text('子项目 A')),
                  ListTile(title: Text('子项目 B')),
                ],
              ),
            ],
          ),
        ),
        DemoSection(
          title: 'ReorderableListView',
          child: SizedBox(
            height: 260,
            child: ReorderableListView(
              onReorderItem: (oldIndex, newIndex) {
                setState(() {
                  // 当前 Flutter API 已提供调整后的 newIndex，可直接插入。
                  final item = _items.removeAt(oldIndex);
                  _items.insert(newIndex, item);
                });
              },
              children: [
                for (final item in _items)
                  ListTile(
                    // 稳定 Key 让框架在重排后复用正确的列表项状态。
                    key: ValueKey(item),
                    title: Text(item),
                    trailing: const Icon(Icons.drag_handle),
                  ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
