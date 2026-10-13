//
//  WebViewContainer.swift
//  WebViewLab
//
//  Created by Leticia Ponce on 12/10/26.
//
import SwiftUI
import WebKit

struct WebViewContainer: UIViewRepresentable {
    let url: URL

    func makeCoordinator() -> Coordinator {
        Coordinator()
    }

    func makeUIView(context: Context) -> WKWebView {
        let configuration = WebViewConfiguration.make(
            bridge: context.coordinator.nativeBridge
        )

        let webView = WKWebView(
            frame: .zero,
            configuration: configuration
        )

        webView.navigationDelegate = context.coordinator

        #if DEBUG
        if #available(iOS 16.4, *) {
            webView.isInspectable = true
        }
        #endif

        print("Registering NativeBridge")

        let request = URLRequest(
            url: url,
            cachePolicy: .reloadIgnoringLocalCacheData,
            timeoutInterval: 30
        )

        webView.load(request)

        return webView
    }

    func updateUIView(
        _ webView: WKWebView,
        context: Context
    ) {
    }

    final class Coordinator: NSObject, WKNavigationDelegate {
        let nativeBridge = NativeBridge()

        func webView(
            _ webView: WKWebView,
            didFinish navigation: WKNavigation!
        ) {
            print(
                "WebView finished loading:",
                webView.url?.absoluteString ?? ""
            )
        }

        func webView(
            _ webView: WKWebView,
            didFail navigation: WKNavigation!,
            withError error: Error
        ) {
            print(
                "WebView failed:",
                error.localizedDescription
            )
        }

        func webView(
            _ webView: WKWebView,
            didFailProvisionalNavigation navigation: WKNavigation!,
            withError error: Error
        ) {
            print(
                "WebView provisional navigation failed:",
                error.localizedDescription
            )
        }
    }
}
