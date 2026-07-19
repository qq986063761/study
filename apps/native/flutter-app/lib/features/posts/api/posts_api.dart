import 'dart:convert';

import 'package:flutter_app_demo/core/network/api_exception.dart';
import 'package:flutter_app_demo/features/posts/models/post.dart';
import 'package:http/http.dart' as http;

/// 封装 JSONPlaceholder 帖子接口及 HTTP 客户端生命周期。
class PostsApi {
  PostsApi({http.Client? client}) : _client = client ?? http.Client();

  static const _base = 'https://jsonplaceholder.typicode.com';
  final http.Client _client;

  /// 释放底层 HTTP 客户端持有的网络资源。
  void close() => _client.close();

  /// 获取指定数量的帖子，接口返回非 200 状态时抛出 [ApiException]。
  Future<List<Post>> fetchPosts({int limit = 20}) async {
    final uri = Uri.parse('$_base/posts?_limit=$limit');
    final response = await _client.get(uri);
    if (response.statusCode != 200) {
      throw ApiException(response.statusCode, response.body);
    }
    final list = jsonDecode(response.body) as List<dynamic>;
    return list.map((e) => Post.fromJson(e as Map<String, dynamic>)).toList();
  }

  /// 根据帖子 ID 获取单条详情。
  Future<Post> fetchPost(int id) async {
    final uri = Uri.parse('$_base/posts/$id');
    final response = await _client.get(uri);
    if (response.statusCode != 200) {
      throw ApiException(response.statusCode, response.body);
    }
    final map = jsonDecode(response.body) as Map<String, dynamic>;
    return Post.fromJson(map);
  }
}
