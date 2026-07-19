import 'package:flutter/foundation.dart';
import 'package:flutter_app_demo/features/posts/api/posts_api.dart';
import 'package:flutter_app_demo/features/posts/models/post.dart';

/// 管理帖子列表及其加载、错误状态，并向界面发布状态变化。
class PostsProvider extends ChangeNotifier {
  PostsProvider(this._api);

  final PostsApi _api;

  List<Post> _posts = [];
  bool _loading = false;
  String? _error;

  /// 返回只读视图，防止界面绕过 Provider 直接修改内部列表。
  List<Post> get posts => List.unmodifiable(_posts);
  bool get loading => _loading;
  String? get error => _error;

  /// 加载帖子列表；已有请求进行时会忽略重复调用。
  Future<void> load() async {
    if (_loading) return;
    _loading = true;
    _error = null;
    notifyListeners();
    try {
      _posts = await _api.fetchPosts();
    } catch (e, st) {
      _error = e.toString();
      debugPrintStack(stackTrace: st);
    } finally {
      _loading = false;
      notifyListeners();
    }
  }

  /// 从已加载的列表中查找帖子，不会额外发起网络请求。
  Post? findById(int id) {
    try {
      return _posts.firstWhere((p) => p.id == id);
    } catch (_) {
      return null;
    }
  }
}
