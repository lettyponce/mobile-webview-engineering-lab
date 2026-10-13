package com.lfp.webviewlab.webview

import android.content.Context
import android.util.Log
import android.webkit.JavascriptInterface
import android.widget.Toast

class WebViewBridge(
    private val context: Context
) {

    @JavascriptInterface
    fun sendMessage(message: String) {
        Log.d(
            "WebViewBridge",
            "Message from JavaScript: $message"
        )

        Toast.makeText(
            context,
            "JS says: $message",
            Toast.LENGTH_SHORT
        ).show()
    }
}