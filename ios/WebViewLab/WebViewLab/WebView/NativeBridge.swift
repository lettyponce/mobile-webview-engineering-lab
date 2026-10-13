//
//  NativeBridge.swift
//  WebViewLab
//
//  Created by Leticia Ponce on 13/10/26.
//

import WebKit

final class NativeBridge: NSObject, WKScriptMessageHandler {

    func userContentController(
        _ userContentController: WKUserContentController,
        didReceive message: WKScriptMessage
    ) {
        print("NativeBridge received message")

        guard message.name == "NativeBridge" else {
            return
        }

        if let value = message.body as? String {
            print("Message from JavaScript: \(value)")
        } else {
            print("Message from JavaScript:", message.body)
        }
    }
}
