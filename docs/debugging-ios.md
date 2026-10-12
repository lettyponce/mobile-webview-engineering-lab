# Debugging iOS WKWebView with Safari Web Inspector

This guide documents how to inspect the iOS `WKWebView` used by the
Mobile WebView Engineering Lab with Safari Web Inspector.

The same shared Web Playground used by Android is loaded in the iOS app,
allowing equivalent debugging scenarios across both platforms.

---

## Prerequisites

Make sure:

- The iOS Simulator is running
- The WebView Lab application is running
- The Web Playground is available locally
- `WKWebView` inspection is enabled
- Safari developer features are enabled

Start the Web Playground from the repository root:

```bash
cd web
python3 -m http.server 8080
```

The iOS Simulator can access the host machine directly through:

```text
http://localhost:8080
```

Unlike the Android Emulator, the iOS Simulator does not require
`10.0.2.2` to reach the host machine.

---

## Allow local HTTP traffic

Because the Web Playground runs locally over HTTP, the app needs to allow
local networking.

In Xcode:

```text
Target
→ Info
→ Custom iOS Target Properties
→ App Transport Security Settings
→ Allow Local Networking = YES
```

This corresponds to:

```xml
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsLocalNetworking</key>
    <true/>
</dict>
```

---

## Configure the WKWebView

A simple shared configuration can be created with:

```swift
import WebKit

enum WebViewConfiguration {
    static func make() -> WKWebViewConfiguration {
        let configuration = WKWebViewConfiguration()

        configuration.defaultWebpagePreferences.allowsContentJavaScript = true

        return configuration
    }
}
```

The WebView itself can then use that configuration:

```swift
let configuration = WebViewConfiguration.make()

let webView = WKWebView(
    frame: .zero,
    configuration: configuration
)
```

---

## Enable WebView inspection

Inspection should only be enabled for debug builds.

```swift
#if DEBUG
if #available(iOS 16.4, *) {
    webView.isInspectable = true
}
#endif
```

The important point is that `isInspectable` belongs to the actual
`WKWebView` instance being displayed.

---

## Load the local Web Playground

The lab loads:

```swift
let url = URL(string: "http://localhost:8080")!
webView.load(URLRequest(url: url))
```

The equivalent SwiftUI wrapper can use:

```swift
WebViewContainer(
    url: URL(string: "http://localhost:8080")!
)
```

---

## Enable Safari developer features

On the Mac:

```text
Safari
→ Settings
→ Advanced
→ Show features for web developers
```

This enables the `Develop` menu.

---

## Open Safari Web Inspector

With the app running and the WKWebView visible:

```text
Safari
→ Develop
→ [iOS Simulator]
→ WebViewLab
→ localhost
```

Safari should open a Web Inspector window connected to the running
`WKWebView`.

A successful connection should show something similar to:

```text
Web Inspector — iPhone Simulator — WebViewLab — localhost
```

---

## Important: reload after connecting the inspector

If Safari Web Inspector is attached after the WebView has already loaded,
earlier console messages and network activity may not be visible.

For consistent debugging:

```text
1. Open the app
2. Open the WKWebView
3. Connect Safari Web Inspector
4. Reload the page
5. Run the test scenarios
```

Use the reload button in Safari Web Inspector before validating the lab.

---

## Validate the Web Playground

Once the inspector is connected, validate the same scenarios used on Android.

### Console

Tap:

```text
Write Console Log
```

Expected result:

```text
Console test triggered from WebView Lab
```

in the Safari Web Inspector Console.

You can also verify the connection directly from the console:

```javascript
1 + 1
```

Expected result:

```text
2
```

Or:

```javascript
console.log("Safari Web Inspector connected")
```

---

### Network

Open:

```text
Web Inspector → Network
```

Then tap:

```text
Run API Request
```

The request initiated by the Web Playground should appear in the Network tab.

---

### Storage

Tap:

```text
Save Storage
```

Then open:

```text
Web Inspector → Storage
```

Validate:

- `localStorage`
- `sessionStorage`

---

### JavaScript Error

Tap:

```text
Trigger JavaScript Error
```

The Console should display:

```text
Intentional WebView Lab JavaScript error
```

---

## Validate the current page manually

Safari Web Inspector can also be used to confirm that the expected page is
loaded.

Run:

```javascript
document.title
```

Expected result:

```text
Mobile WebView Engineering Lab
```

This is useful when the inspector is connected but the expected logs are not
visible.

---

## Troubleshooting

If the Simulator appears in Safari but the app shows:

```text
No Inspectable Applications
```

check that the displayed `WKWebView` instance has:

```swift
webView.isInspectable = true
```

Also verify that:

- The app is running
- The WebView is currently visible
- The page has loaded
- The build is a debug build
- Safari developer features are enabled

If the inspector opens but Console or Network appears empty:

```text
Connect inspector
        ↓
Reload page
        ↓
Open Console / Network
        ↓
Trigger scenario again
```

---

## Debugging flow

```text
iOS Application
      │
      ▼
   WKWebView
      │
      ▼
isInspectable = true
      │
      ▼
Safari Develop Menu
      │
      ▼
iOS Simulator / Device
      │
      ▼
WebViewLab
      │
      ▼
Safari Web Inspector
      │
      ▼
Console / Network / DOM / Storage
```

---

## Android vs iOS inspection

| Concern | Android | iOS |
| --- | --- | --- |
| Embedded browser | `android.webkit.WebView` | `WKWebView` |
| Inspector | Chrome DevTools | Safari Web Inspector |
| Debug setting | `setWebContentsDebuggingEnabled(true)` | `isInspectable = true` |
| Local host URL | `http://10.0.2.2:8080` | `http://localhost:8080` |
| Discovery | `chrome://inspect` | Safari `Develop` menu |
| Fallback | ADB port forwarding | Reconnect / reload inspector |
| Console | Chrome Console | Safari Console |
| Network | Chrome Network | Safari Network |
| Storage | Chrome Application | Safari Storage |

---

## Key takeaway

Native debugging tools only expose part of a hybrid application's behavior.

For a WebView-based flow, Safari Web Inspector provides visibility into the
embedded web runtime, including JavaScript execution, network requests,
storage, DOM state, and browser-level errors that may not appear in Xcode logs.
