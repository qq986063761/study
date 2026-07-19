import 'package:flutter/material.dart';

import 'package:flutter_app_demo/features/widget_gallery/widgets/demo_section.dart';

/// 展示表单输入、选择控件及系统日期时间选择器。
class InputDemo extends StatefulWidget {
  const InputDemo({super.key});

  @override
  State<InputDemo> createState() => _InputDemoState();
}

class _InputDemoState extends State<InputDemo> {
  final _formKey = GlobalKey<FormState>();
  bool _checked = true;
  bool _switched = true;
  String _radio = 'a';
  double _slider = 35;
  RangeValues _range = const RangeValues(20, 70);
  String _dropdown = 'Dart';
  DateTime? _date;
  TimeOfDay? _time;

  @override
  Widget build(BuildContext context) {
    return DemoPage(
      children: [
        const DemoSection(
          title: 'TextField',
          child: Column(
            children: [
              TextField(
                decoration: InputDecoration(
                  labelText: '用户名',
                  hintText: '请输入用户名',
                  prefixIcon: Icon(Icons.person_outline),
                  border: OutlineInputBorder(),
                ),
              ),
              SizedBox(height: 12),
              TextField(
                obscureText: true,
                decoration: InputDecoration(
                  labelText: '密码',
                  prefixIcon: Icon(Icons.lock_outline),
                  border: OutlineInputBorder(),
                ),
              ),
            ],
          ),
        ),
        DemoSection(
          title: 'TextFormField / Form',
          child: Form(
            key: _formKey,
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  child: TextFormField(
                    decoration: const InputDecoration(
                      labelText: '邮箱',
                      border: OutlineInputBorder(),
                    ),
                    validator: (value) =>
                        value != null && value.contains('@') ? null : '请输入有效邮箱',
                  ),
                ),
                const SizedBox(width: 12),
                FilledButton(
                  onPressed: () => _formKey.currentState?.validate(),
                  child: const Text('验证'),
                ),
              ],
            ),
          ),
        ),
        DemoSection(
          title: 'Checkbox / Switch',
          child: Column(
            children: [
              CheckboxListTile(
                contentPadding: EdgeInsets.zero,
                title: const Text('接收更新通知'),
                value: _checked,
                onChanged: (value) => setState(() => _checked = value ?? false),
              ),
              SwitchListTile(
                contentPadding: EdgeInsets.zero,
                title: const Text('自动同步'),
                value: _switched,
                onChanged: (value) => setState(() => _switched = value),
              ),
            ],
          ),
        ),
        DemoSection(
          title: 'Radio / RadioGroup',
          child: RadioGroup<String>(
            groupValue: _radio,
            onChanged: (value) => setState(() => _radio = value ?? 'a'),
            child: const Row(
              children: [
                Radio<String>(value: 'a'),
                Text('选项 A'),
                SizedBox(width: 16),
                Radio<String>(value: 'b'),
                Text('选项 B'),
              ],
            ),
          ),
        ),
        DemoSection(
          title: 'Slider / RangeSlider',
          child: Column(
            children: [
              Slider(
                value: _slider,
                min: 0,
                max: 100,
                divisions: 20,
                label: _slider.round().toString(),
                onChanged: (value) => setState(() => _slider = value),
              ),
              RangeSlider(
                values: _range,
                min: 0,
                max: 100,
                divisions: 10,
                labels: RangeLabels(
                  _range.start.round().toString(),
                  _range.end.round().toString(),
                ),
                onChanged: (value) => setState(() => _range = value),
              ),
            ],
          ),
        ),
        DemoSection(
          title: 'DropdownMenu',
          child: DropdownMenu<String>(
            initialSelection: _dropdown,
            label: const Text('语言'),
            dropdownMenuEntries: const [
              DropdownMenuEntry(value: 'Dart', label: 'Dart'),
              DropdownMenuEntry(value: 'Kotlin', label: 'Kotlin'),
              DropdownMenuEntry(value: 'Swift', label: 'Swift'),
            ],
            onSelected: (value) {
              if (value != null) setState(() => _dropdown = value);
            },
          ),
        ),
        DemoSection(
          title: 'showDatePicker / showTimePicker',
          child: Wrap(
            spacing: 12,
            runSpacing: 8,
            crossAxisAlignment: WrapCrossAlignment.center,
            children: [
              OutlinedButton.icon(
                icon: const Icon(Icons.calendar_today),
                label: Text(
                  _date == null
                      ? '选择日期'
                      : '${_date!.year}-${_date!.month}-${_date!.day}',
                ),
                onPressed: () async {
                  final value = await showDatePicker(
                    context: context,
                    firstDate: DateTime(2020),
                    lastDate: DateTime(2035),
                    initialDate: _date ?? DateTime.now(),
                  );
                  // 选择器关闭前页面可能已销毁，更新状态前需检查 mounted。
                  if (value != null && mounted) setState(() => _date = value);
                },
              ),
              OutlinedButton.icon(
                icon: const Icon(Icons.schedule),
                label: Text(_time?.format(context) ?? '选择时间'),
                onPressed: () async {
                  final value = await showTimePicker(
                    context: context,
                    initialTime: _time ?? TimeOfDay.now(),
                  );
                  if (value != null && mounted) setState(() => _time = value);
                },
              ),
            ],
          ),
        ),
      ],
    );
  }
}
