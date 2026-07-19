import 'package:flutter/material.dart';

import 'package:flutter_app_demo/features/widget_gallery/widgets/demo_section.dart';

/// 展示加载状态、消息提示、对话框和底部弹层。
class FeedbackDemo extends StatefulWidget {
  const FeedbackDemo({super.key});

  @override
  State<FeedbackDemo> createState() => _FeedbackDemoState();
}

class _FeedbackDemoState extends State<FeedbackDemo> {
  bool _loading = true;

  @override
  Widget build(BuildContext context) {
    return DemoPage(
      children: [
        DemoSection(
          title: 'CircularProgressIndicator / LinearProgressIndicator',
          child: Row(
            children: [
              const CircularProgressIndicator(),
              const SizedBox(width: 24),
              Expanded(
                child: Column(
                  children: [
                    LinearProgressIndicator(value: _loading ? null : 0.72),
                    const SizedBox(height: 12),
                    SwitchListTile(
                      contentPadding: EdgeInsets.zero,
                      title: const Text('不确定进度'),
                      value: _loading,
                      onChanged: (value) => setState(() => _loading = value),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
        DemoSection(
          title: 'SnackBar / MaterialBanner',
          child: Wrap(
            spacing: 12,
            runSpacing: 8,
            children: [
              FilledButton(
                onPressed: () {
                  // 先隐藏当前提示，避免用户连续点击时堆叠多个 SnackBar。
                  ScaffoldMessenger.of(context)
                    ..hideCurrentSnackBar()
                    ..showSnackBar(
                      SnackBar(
                        content: const Text('操作已完成'),
                        action: SnackBarAction(label: '撤销', onPressed: () {}),
                      ),
                    );
                },
                child: const Text('SnackBar'),
              ),
              OutlinedButton(
                onPressed: () {
                  // MaterialBanner 由最近的 ScaffoldMessenger 统一管理。
                  ScaffoldMessenger.of(context)
                    ..hideCurrentMaterialBanner()
                    ..showMaterialBanner(
                      MaterialBanner(
                        content: const Text('这是一条页面级通知'),
                        leading: const Icon(Icons.info_outline),
                        actions: [
                          TextButton(
                            onPressed: () => ScaffoldMessenger.of(
                              context,
                            ).hideCurrentMaterialBanner(),
                            child: const Text('关闭'),
                          ),
                        ],
                      ),
                    );
                },
                child: const Text('MaterialBanner'),
              ),
            ],
          ),
        ),
        DemoSection(
          title: 'AlertDialog / SimpleDialog',
          child: Wrap(
            spacing: 12,
            runSpacing: 8,
            children: [
              FilledButton.tonal(
                onPressed: () => showDialog<void>(
                  context: context,
                  builder: (context) => AlertDialog(
                    title: const Text('删除项目？'),
                    content: const Text('此操作仅用于演示。'),
                    actions: [
                      TextButton(
                        onPressed: () => Navigator.pop(context),
                        child: const Text('取消'),
                      ),
                      FilledButton(
                        onPressed: () => Navigator.pop(context),
                        child: const Text('确认'),
                      ),
                    ],
                  ),
                ),
                child: const Text('AlertDialog'),
              ),
              OutlinedButton(
                onPressed: () => showDialog<void>(
                  context: context,
                  builder: (context) => SimpleDialog(
                    title: const Text('选择账户'),
                    children: [
                      SimpleDialogOption(
                        onPressed: () => Navigator.pop(context),
                        child: const Text('个人账户'),
                      ),
                      SimpleDialogOption(
                        onPressed: () => Navigator.pop(context),
                        child: const Text('工作账户'),
                      ),
                    ],
                  ),
                ),
                child: const Text('SimpleDialog'),
              ),
            ],
          ),
        ),
        DemoSection(
          title: 'BottomSheet',
          child: Align(
            alignment: Alignment.centerLeft,
            child: FilledButton.tonalIcon(
              icon: const Icon(Icons.vertical_align_top),
              label: const Text('打开 BottomSheet'),
              onPressed: () => showModalBottomSheet<void>(
                context: context,
                showDragHandle: true,
                builder: (context) => SafeArea(
                  child: Padding(
                    padding: const EdgeInsets.fromLTRB(16, 0, 16, 24),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const ListTile(
                          leading: Icon(Icons.share_outlined),
                          title: Text('分享'),
                        ),
                        ListTile(
                          leading: const Icon(Icons.close),
                          title: const Text('关闭'),
                          onTap: () => Navigator.pop(context),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
        const DemoSection(
          title: 'Tooltip',
          child: Align(
            alignment: Alignment.centerLeft,
            child: Tooltip(
              message: '收藏当前项目',
              child: Icon(Icons.favorite_outline, size: 32),
            ),
          ),
        ),
      ],
    );
  }
}
