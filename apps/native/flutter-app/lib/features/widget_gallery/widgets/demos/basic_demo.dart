import 'package:flutter/material.dart';

import 'package:flutter_app_demo/features/widget_gallery/widgets/demo_section.dart';

/// 展示文本、图标、图片等基础内容控件。
class BasicDemo extends StatelessWidget {
  const BasicDemo({super.key});

  @override
  Widget build(BuildContext context) {
    return DemoPage(
      children: [
        DemoSection(
          title: 'Text / SelectableText',
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Flutter 控件示例',
                style: Theme.of(context).textTheme.headlineSmall,
              ),
              const SizedBox(height: 8),
              const Text(
                '这是一段最多显示两行、超出后省略的文本。这是一段最多显示两行、超出后省略的文本。',
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: 8),
              const SelectableText('这段文字可以选中和复制'),
            ],
          ),
        ),
        const DemoSection(
          title: 'Icon / FlutterLogo / CircleAvatar',
          child: Wrap(
            spacing: 20,
            runSpacing: 16,
            crossAxisAlignment: WrapCrossAlignment.center,
            children: [
              Icon(Icons.favorite, color: Colors.red, size: 32),
              Icon(Icons.flutter_dash, color: Colors.blue, size: 36),
              FlutterLogo(size: 42),
              CircleAvatar(child: Text('FL')),
            ],
          ),
        ),
        DemoSection(
          title: 'Image',
          child: ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: Image.network(
              'https://flutter.github.io/assets-for-api-docs/assets/widgets/owl.jpg',
              width: 220,
              height: 140,
              fit: BoxFit.cover,
              alignment: Alignment.topCenter,
              // 网络图片不可用时保持相同高度，避免页面布局跳动。
              errorBuilder: (context, error, stackTrace) => const SizedBox(
                height: 140,
                child: ColoredBox(
                  color: Color(0xFFE0E0E0),
                  child: Center(child: Icon(Icons.broken_image_outlined)),
                ),
              ),
            ),
          ),
        ),
        const DemoSection(
          title: 'Card / ListTile',
          child: Card(
            child: ListTile(
              leading: CircleAvatar(child: Icon(Icons.person_outline)),
              title: Text('ListTile 标题'),
              subtitle: Text('Card 中的列表项'),
              trailing: Icon(Icons.more_vert),
            ),
          ),
        ),
        DemoSection(
          title: 'Chip / Badge',
          child: Wrap(
            spacing: 10,
            runSpacing: 10,
            crossAxisAlignment: WrapCrossAlignment.center,
            children: [
              const Chip(avatar: Icon(Icons.tag), label: Text('Chip')),
              const InputChip(label: Text('InputChip')),
              FilterChip(
                label: const Text('FilterChip'),
                selected: true,
                onSelected: (_) {},
              ),
              const Badge(
                label: Text('3'),
                child: Icon(Icons.mail_outline, size: 30),
              ),
            ],
          ),
        ),
        const DemoSection(
          title: 'Divider / VerticalDivider',
          child: SizedBox(
            height: 48,
            child: Row(
              children: [
                Expanded(child: Divider()),
                VerticalDivider(),
                Expanded(child: Divider(thickness: 3)),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
