import 'package:flutter/cupertino.dart';

import 'package:flutter_app_demo/features/widget_gallery/widgets/demo_section.dart';

/// 展示常用的 iOS 风格 Cupertino 控件。
class CupertinoDemo extends StatefulWidget {
  const CupertinoDemo({super.key});

  @override
  State<CupertinoDemo> createState() => _CupertinoDemoState();
}

class _CupertinoDemoState extends State<CupertinoDemo> {
  static const _cities = ['北京', '上海', '深圳', '杭州'];

  final _pickerController = FixedExtentScrollController();
  bool _enabled = true;
  double _value = 0.4;
  int _segment = 0;
  int _pickerIndex = 0;

  @override
  void dispose() {
    // 手动创建的滚动控制器必须随页面销毁，避免继续持有滚动位置监听。
    _pickerController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return DemoPage(
      children: [
        DemoSection(
          title: 'CupertinoButton',
          child: Wrap(
            spacing: 12,
            runSpacing: 8,
            children: [
              CupertinoButton.filled(
                onPressed: () {},
                child: const Text('Filled'),
              ),
              CupertinoButton(onPressed: () {}, child: const Text('Plain')),
            ],
          ),
        ),
        const DemoSection(
          title: 'CupertinoTextField / CupertinoSearchTextField',
          child: Column(
            children: [
              CupertinoTextField(
                placeholder: '请输入内容',
                prefix: Padding(
                  padding: EdgeInsets.only(left: 8),
                  child: Icon(CupertinoIcons.person),
                ),
                padding: EdgeInsets.all(12),
              ),
              SizedBox(height: 12),
              CupertinoSearchTextField(placeholder: '搜索'),
            ],
          ),
        ),
        DemoSection(
          title: 'CupertinoSwitch / CupertinoSlider',
          child: Column(
            children: [
              Row(
                children: [
                  const Expanded(child: Text('启用通知')),
                  CupertinoSwitch(
                    value: _enabled,
                    onChanged: (value) => setState(() => _enabled = value),
                  ),
                ],
              ),
              CupertinoSlider(
                value: _value,
                onChanged: (value) => setState(() => _value = value),
              ),
            ],
          ),
        ),
        DemoSection(
          title: 'CupertinoSlidingSegmentedControl',
          child: CupertinoSlidingSegmentedControl<int>(
            groupValue: _segment,
            children: const {
              0: Padding(padding: EdgeInsets.all(8), child: Text('日')),
              1: Padding(padding: EdgeInsets.all(8), child: Text('周')),
              2: Padding(padding: EdgeInsets.all(8), child: Text('月')),
            },
            onValueChanged: (value) {
              if (value != null) setState(() => _segment = value);
            },
          ),
        ),
        const DemoSection(
          title: 'CupertinoActivityIndicator',
          child: Align(
            alignment: Alignment.centerLeft,
            child: CupertinoActivityIndicator(radius: 16),
          ),
        ),
        DemoSection(
          title: 'CupertinoPicker',
          child: SizedBox(
            height: 170,
            child: Column(
              children: [
                Expanded(
                  child: CupertinoPicker(
                    itemExtent: 36,
                    scrollController: _pickerController,
                    onSelectedItemChanged: (value) =>
                        setState(() => _pickerIndex = value),
                    children: [for (final city in _cities) Text(city)],
                  ),
                ),
                Text('当前：${_cities[_pickerIndex]}'),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
