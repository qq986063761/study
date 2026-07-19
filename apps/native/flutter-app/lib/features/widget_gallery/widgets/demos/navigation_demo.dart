import 'package:flutter/material.dart';

import 'package:flutter_app_demo/features/widget_gallery/widgets/demo_section.dart';

/// 展示底部导航、侧边导航、标签页和抽屉导航。
class NavigationDemo extends StatefulWidget {
  const NavigationDemo({super.key});

  @override
  State<NavigationDemo> createState() => _NavigationDemoState();
}

class _NavigationDemoState extends State<NavigationDemo> {
  int _barIndex = 0;
  int _railIndex = 0;

  @override
  Widget build(BuildContext context) {
    return DemoPage(
      children: [
        DemoSection(
          title: 'NavigationBar',
          child: NavigationBar(
            selectedIndex: _barIndex,
            onDestinationSelected: (value) => setState(() => _barIndex = value),
            destinations: const [
              NavigationDestination(
                icon: Icon(Icons.home_outlined),
                label: '首页',
              ),
              NavigationDestination(icon: Icon(Icons.search), label: '搜索'),
              NavigationDestination(
                icon: Icon(Icons.person_outline),
                label: '我的',
              ),
            ],
          ),
        ),
        DemoSection(
          title: 'NavigationRail',
          child: SizedBox(
            height: 220,
            child: Row(
              children: [
                NavigationRail(
                  selectedIndex: _railIndex,
                  labelType: NavigationRailLabelType.all,
                  onDestinationSelected: (value) =>
                      setState(() => _railIndex = value),
                  destinations: const [
                    NavigationRailDestination(
                      icon: Icon(Icons.inbox_outlined),
                      label: Text('收件箱'),
                    ),
                    NavigationRailDestination(
                      icon: Icon(Icons.star_outline),
                      label: Text('收藏'),
                    ),
                  ],
                ),
                const VerticalDivider(width: 1),
                Expanded(child: Center(child: Text('当前页面 ${_railIndex + 1}'))),
              ],
            ),
          ),
        ),
        const DemoSection(
          title: 'TabBar / TabBarView',
          child: SizedBox(
            height: 190,
            child: DefaultTabController(
              length: 3,
              child: Column(
                children: [
                  TabBar(
                    tabs: [
                      Tab(text: '动态'),
                      Tab(text: '关注'),
                      Tab(text: '收藏'),
                    ],
                  ),
                  Expanded(
                    child: TabBarView(
                      children: [
                        Center(child: Text('动态内容')),
                        Center(child: Text('关注内容')),
                        Center(child: Text('收藏内容')),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
        DemoSection(
          title: 'AppBar / Drawer',
          child: SizedBox(
            height: 210,
            // 嵌套 Scaffold 为示例提供独立的 AppBar 和 Drawer 上下文。
            child: Scaffold(
              appBar: AppBar(title: const Text('嵌套页面')),
              drawer: const Drawer(
                child: SafeArea(
                  child: Column(
                    children: [
                      DrawerHeader(child: FlutterLogo(size: 72)),
                      ListTile(
                        leading: Icon(Icons.home_outlined),
                        title: Text('首页'),
                      ),
                    ],
                  ),
                ),
              ),
              body: const Center(child: Text('点击左上角打开 Drawer')),
            ),
          ),
        ),
      ],
    );
  }
}
