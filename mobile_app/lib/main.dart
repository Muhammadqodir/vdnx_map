import 'dart:developer';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:webview_flutter/webview_flutter.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'ВДНХ',
      debugShowCheckedModeBanner: false,
      theme:
          ThemeData(primarySwatch: Colors.blue, brightness: Brightness.light),
      home: const MyHomePage(title: 'ВДНХ'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  bool loading = true;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: AnnotatedRegion<SystemUiOverlayStyle>(
        value: SystemUiOverlayStyle.dark,
        child: SafeArea(
          child: Stack(
            children: [
              WebView(
                initialUrl: 'http://89.108.98.8/',
                gestureNavigationEnabled: true,
                javascriptMode: JavascriptMode.unrestricted,
                onProgress: (int progress) {
                  if (progress == 100) {
                    setState(() {
                      loading = false;
                    });
                  }
                },
                onWebResourceError: (error) {
                  log(error.description);
                },
              ),
              loading
                  ? Expanded(
                      child: Container(
                        color: Colors.white,
                        child: Center(
                          child: SizedBox(
                            width: 100,
                            height: 100,
                            child: Image.asset('images/vdnx.png'),
                          ),
                        ),
                      ),
                    )
                  : const SizedBox()
            ],
          ),
        ),
      ),
    );
  }
}
