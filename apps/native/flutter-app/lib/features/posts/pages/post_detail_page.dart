import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import 'package:flutter_app_demo/features/posts/api/posts_api.dart';
import 'package:flutter_app_demo/features/posts/models/post.dart';
import 'package:flutter_app_demo/features/posts/providers/posts_provider.dart';

/// 展示指定 [postId] 的帖子详情。
class PostDetailPage extends StatefulWidget {
  const PostDetailPage({super.key, required this.postId});

  final int postId;

  @override
  State<PostDetailPage> createState() => _PostDetailPageState();
}

class _PostDetailPageState extends State<PostDetailPage> {
  Post? _post;
  bool _loading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    // 优先复用列表页已获取的数据，直接访问详情 URL 时才请求接口。
    final cached = context.read<PostsProvider>().findById(widget.postId);
    if (cached != null) {
      setState(() {
        _post = cached;
        _loading = false;
        _error = null;
      });
      return;
    }
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final p = await context.read<PostsApi>().fetchPost(widget.postId);
      // 异步请求完成时页面可能已被移出导航栈。
      if (!mounted) return;
      setState(() {
        _post = p;
        _loading = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _loading = false;
        _error = e.toString();
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final post = _post;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(8, 0, 8, 8),
          child: Row(
            children: [
              IconButton(
                icon: const Icon(Icons.arrow_back),
                onPressed: () {
                  // 深链接直接进入详情页时没有可弹出的页面，回退到列表路由。
                  if (context.canPop()) {
                    context.pop();
                  } else {
                    context.go('/posts');
                  }
                },
              ),
              const Text(
                '子路由：帖子详情',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
              ),
            ],
          ),
        ),
        if (_loading)
          const Expanded(child: Center(child: CircularProgressIndicator()))
        else if (_error != null)
          Expanded(
            child: Center(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: SelectableText(_error!),
              ),
            ),
          )
        else if (post != null)
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    post.title,
                    style: Theme.of(context).textTheme.headlineSmall,
                  ),
                  const SizedBox(height: 12),
                  Text(
                    'userId: ${post.userId}  ·  id: ${post.id}',
                    style: Theme.of(context).textTheme.labelMedium,
                  ),
                  const SizedBox(height: 16),
                  SelectableText(post.body),
                ],
              ),
            ),
          )
        else
          const Expanded(child: Center(child: Text('未找到该帖子'))),
      ],
    );
  }
}
