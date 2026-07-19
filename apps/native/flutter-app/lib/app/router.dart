import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import 'package:flutter_app_demo/app/theme.dart';
import 'package:flutter_app_demo/features/posts/pages/post_detail_page.dart';
import 'package:flutter_app_demo/features/posts/pages/posts_list_page.dart';
import 'package:flutter_app_demo/features/posts/providers/posts_provider.dart';
import 'package:flutter_app_demo/features/widget_gallery/models/demo_catalog.dart';
import 'package:flutter_app_demo/features/widget_gallery/pages/widget_demo_page.dart';
import 'package:flutter_app_demo/features/widget_gallery/pages/widget_gallery_page.dart';

/// 创建应用路由树，并通过 [ShellRoute] 复用顶栏和底部导航。
class AppRouter {
  AppRouter._();

  static GoRouter create() {
    return GoRouter(
      initialLocation: '/widgets',
      routes: [
        // ShellRoute 只替换 child，切换一级页面时保留统一的应用框架。
        ShellRoute(
          builder: (context, state, child) =>
              _AppShell(location: state.uri.path, child: child),
          routes: [
            GoRoute(
              path: '/widgets',
              pageBuilder: (context, state) => NoTransitionPage<void>(
                key: state.pageKey,
                child: const WidgetGalleryPage(),
              ),
              routes: [
                GoRoute(
                  path: ':category',
                  builder: (context, state) => WidgetDemoPage(
                    categoryId: state.pathParameters['category']!,
                  ),
                ),
              ],
            ),
            GoRoute(
              path: '/posts',
              pageBuilder: (context, state) => NoTransitionPage<void>(
                key: state.pageKey,
                child: const PostsListPage(),
              ),
              routes: [
                // 相对路径会组合为 /posts/:id，形成帖子列表的子路由。
                GoRoute(
                  path: ':id',
                  pageBuilder: (context, state) {
                    final idStr = state.pathParameters['id']!;
                    final id = int.tryParse(idStr) ?? 0;
                    return MaterialPage<void>(
                      key: state.pageKey,
                      child: PostDetailPage(postId: id),
                    );
                  },
                ),
              ],
            ),
          ],
        ),
      ],
    );
  }
}

class _AppShell extends StatelessWidget {
  const _AppShell({required this.location, required this.child});

  final String location;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final posts = context.watch<PostsProvider>();
    final themeMode = context.watch<ThemeModeProvider>();
    final isPosts = location.startsWith('/posts');
    // 详情页沿用对应分类标题；一级控件页则显示默认标题。
    final categoryId = location.startsWith('/widgets/')
        ? location.substring('/widgets/'.length)
        : null;
    final category = categoryId == null ? null : findDemoCategory(categoryId);

    return Scaffold(
      appBar: AppBar(
        title: Text(category?.title ?? (isPosts ? '帖子示例' : 'Flutter 控件示例')),
        actions: [
          if (isPosts && posts.loading)
            const Padding(
              padding: EdgeInsets.only(right: 16),
              child: Center(
                child: SizedBox(
                  width: 22,
                  height: 22,
                  child: CircularProgressIndicator(strokeWidth: 2),
                ),
              ),
            ),
          IconButton(
            tooltip: '切换明暗主题',
            onPressed: themeMode.toggle,
            icon: Icon(
              Theme.of(context).brightness == Brightness.dark
                  ? Icons.light_mode
                  : Icons.dark_mode,
            ),
          ),
        ],
      ),
      body: child,
      bottomNavigationBar: NavigationBar(
        selectedIndex: isPosts ? 1 : 0,
        onDestinationSelected: (index) {
          if (index == 0) {
            context.go('/widgets');
          } else {
            context.go('/posts');
          }
        },
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.widgets_outlined),
            selectedIcon: Icon(Icons.widgets),
            label: '控件',
          ),
          NavigationDestination(
            icon: Icon(Icons.article_outlined),
            selectedIcon: Icon(Icons.article),
            label: '帖子',
          ),
        ],
      ),
    );
  }
}
