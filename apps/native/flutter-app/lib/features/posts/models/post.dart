/// JSONPlaceholder 返回的帖子领域模型。
class Post {
  const Post({
    required this.id,
    required this.userId,
    required this.title,
    required this.body,
  });

  /// 将接口中的 JSON 对象转换为强类型模型。
  factory Post.fromJson(Map<String, dynamic> json) {
    return Post(
      id: json['id'] as int,
      userId: json['userId'] as int,
      title: json['title'] as String,
      body: json['body'] as String,
    );
  }

  final int id;
  final int userId;
  final String title;
  final String body;
}
