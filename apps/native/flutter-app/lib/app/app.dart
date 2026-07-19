import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import 'package:flutter_app_demo/app/router.dart';
import 'package:flutter_app_demo/app/theme.dart';
import 'package:flutter_app_demo/features/posts/api/posts_api.dart';
import 'package:flutter_app_demo/features/posts/providers/posts_provider.dart';

/// 应用根组件，负责注册全局依赖。
class FlutterDemoApp extends StatelessWidget {
  const FlutterDemoApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        Provider<PostsApi>(
          create: (_) => PostsApi(),
          dispose: (_, api) => api.close(),
        ),
        ChangeNotifierProvider(create: (_) => ThemeModeProvider()),
        ChangeNotifierProvider(
          create: (context) => PostsProvider(context.read<PostsApi>()),
        ),
      ],
      child: const _AppView(),
    );
  }
}

/// 包含路由和主题的应用视图，需要位于全局 Provider 之下。
class _AppView extends StatefulWidget {
  const _AppView();

  @override
  State<_AppView> createState() => _AppViewState();
}

class _AppViewState extends State<_AppView> {
  // 路由器只创建一次，避免主题变化触发重建时丢失当前导航栈。
  late final GoRouter _router = AppRouter.create();

  @override
  Widget build(BuildContext context) {
    final themeMode = context.watch<ThemeModeProvider>();
    return MaterialApp.router(
      title: 'Flutter Demo',
      themeMode: themeMode.mode,
      theme: AppTheme.light,
      darkTheme: AppTheme.dark,
      routerConfig: _router,
    );
  }
}
