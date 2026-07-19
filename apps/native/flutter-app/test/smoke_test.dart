import 'package:flutter_app_demo/features/posts/models/post.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  test('Post.fromJson maps API fields', () {
    final post = Post.fromJson({
      'id': 7,
      'userId': 3,
      'title': 'Latest Flutter',
      'body': 'Multi-platform demo',
    });

    expect(post.id, 7);
    expect(post.userId, 3);
    expect(post.title, 'Latest Flutter');
    expect(post.body, 'Multi-platform demo');
  });
}
