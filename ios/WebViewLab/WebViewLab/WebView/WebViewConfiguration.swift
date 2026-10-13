//
//  WebViewConfiguration.swift
//  WebViewLab
//
//  Created by Leticia Ponce on 12/10/26.
//

import WebKit

enum WebViewConfiguration {

    static func make(
        bridge: WKScriptMessageHandler
    ) -> WKWebViewConfiguration {

        let configuration = WKWebViewConfiguration()

        configuration.defaultWebpagePreferences.allowsContentJavaScript = true

        configuration.userContentController.add(
            bridge,
            name: "NativeBridge"
        )

        return configuration
    }
}
