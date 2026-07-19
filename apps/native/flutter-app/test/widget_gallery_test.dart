import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:flutter_app_demo/features/widget_gallery/pages/widget_gallery_page.dart';
import 'package:flutter_app_demo/features/widget_gallery/widgets/demos/animation_demo.dart';
import 'package:flutter_app_demo/features/widget_gallery/widgets/demos/basic_demo.dart';
import 'package:flutter_app_demo/features/widget_gallery/widgets/demos/buttons_demo.dart';
import 'package:flutter_app_demo/features/widget_gallery/widgets/demos/cupertino_demo.dart';
import 'package:flutter_app_demo/features/widget_gallery/widgets/demos/feedback_demo.dart';
import 'package:flutter_app_demo/features/widget_gallery/widgets/demos/input_demo.dart';
import 'package:flutter_app_demo/features/widget_gallery/widgets/demos/layout_demo.dart';
import 'package:flutter_app_demo/features/widget_gallery/widgets/demos/navigation_demo.dart';
import 'package:flutter_app_demo/features/widget_gallery/widgets/demos/scrolling_demo.dart';

void main() {
  testWidgets('widget gallery shows demo categories', (tester) async {
    await tester.pumpWidget(
      const MaterialApp(home: Scaffold(body: WidgetGalleryPage())),
    );

    expect(find.text('基础与展示'), findsOneWidget);
    expect(find.text('布局'), findsOneWidget);
  });

  testWidgets('all widget demo pages build on a phone-sized viewport', (
    tester,
  ) async {
    tester.view.physicalSize = const Size(390, 844);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);

    final demos = <Widget>[
      const BasicDemo(),
      const LayoutDemo(),
      const ButtonsDemo(),
      const InputDemo(),
      const FeedbackDemo(),
      const ScrollingDemo(),
      const NavigationDemo(),
      const AnimationDemo(),
      const CupertinoDemo(),
    ];

    for (final demo in demos) {
      await tester.pumpWidget(MaterialApp(home: Scaffold(body: demo)));
      await tester.pump(const Duration(milliseconds: 100));
      expect(
        tester.takeException(),
        isNull,
        reason: demo.runtimeType.toString(),
      );
    }
  });
}
