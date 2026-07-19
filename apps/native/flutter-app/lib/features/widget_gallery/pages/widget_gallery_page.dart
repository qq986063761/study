import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import 'package:flutter_app_demo/features/widget_gallery/models/demo_catalog.dart';

/// 以响应式网格展示全部控件示例分类。
class WidgetGalleryPage extends StatelessWidget {
  const WidgetGalleryPage({super.key});

  @override
  Widget build(BuildContext context) {
    return GridView.builder(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 28),
      gridDelegate: const SliverGridDelegateWithMaxCrossAxisExtent(
        // 根据可用宽度自动调整列数，同时限制单个分类卡片的宽度。
        maxCrossAxisExtent: 420,
        mainAxisExtent: 112,
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
      ),
      itemCount: demoCategories.length,
      itemBuilder: (context, index) {
        final category = demoCategories[index];
        return Card(
          clipBehavior: Clip.antiAlias,
          child: InkWell(
            onTap: () => context.push('/widgets/${category.id}'),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  Icon(category.icon, size: 30),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          category.title,
                          style: Theme.of(context).textTheme.titleMedium,
                        ),
                        const SizedBox(height: 4),
                        Text(
                          category.subtitle,
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                          style: Theme.of(context).textTheme.bodySmall,
                        ),
                      ],
                    ),
                  ),
                  const Icon(Icons.chevron_right),
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}
