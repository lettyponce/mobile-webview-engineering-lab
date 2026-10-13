# Debugging Android WebView with Chrome DevTools

This guide documents how to inspect the Android WebView used by the
Mobile WebView Engineering Lab with Chrome DevTools.

It also includes a fallback approach using ADB port forwarding when
`chrome://inspect` does not automatically discover the WebView.

---

## Prerequisites

Make sure:

- The Android Emulator is running
- The WebView Lab application is running
- The Web Playground is available locally
- WebView debugging is enabled
- ADB can see the emulator

The Web Playground can be started from the repository root with:

```bash
cd web
python3 -m http.server 8080
```

The Android Emulator accesses the host machine through:

```text
http://10.0.2.2:8080
```

---

## Enable WebView debugging

WebView debugging should only be enabled for debug builds.

```kotlin
if (BuildConfig.DEBUG) {
    WebView.setWebContentsDebuggingEnabled(true)
}
```

The WebView also requires JavaScript and DOM storage for the scenarios
used by this lab:

```kotlin
settings.javaScriptEnabled = true
settings.domStorageEnabled = true
```

---

## Verify that ADB sees the emulator

Run:

```bash
adb devices
```

Expected output:

```text
List of devices attached
emulator-5554    device
```

If the emulator is not listed, restart ADB:

```bash
adb kill-server
adb start-server
adb devices
```

---

## Standard inspection flow

Open Chrome and navigate to:

```text
chrome://inspect/#devices
```

Enable:

```text
Discover USB devices
```

If Chrome automatically discovers the WebView, it should appear as a
remote target.

Example:

```text
Mobile WebView Engineering Lab
http://10.0.2.2:8080
```

Click:

```text
inspect
```

Chrome DevTools should open.

---

## When chrome://inspect does not discover the WebView

In some environments, ADB can see the emulator and WebView debugging
can be enabled correctly, but Chrome still does not list the WebView.

The following steps can be used as a fallback.

### 1. Find the application process

Run:

```bash
adb shell pidof com.lfp.webviewlab
```

Example:

```text
17116
```

---

### 2. Find the WebView DevTools socket

Run:

```bash
adb shell cat /proc/net/unix | grep webview_devtools
```

Example:

```text
@webview_devtools_remote_17116
```

The socket is associated with the application process.

> The `@` displayed by `/proc/net/unix` represents an abstract Unix
> socket. Do not include it when passing the socket name to
> `adb forward`.

---

### 3. Forward the DevTools socket

Remove an existing forwarding rule if necessary:

```bash
adb forward --remove tcp:9222
```

Create a new forwarding rule:

```bash
adb forward \
  tcp:9222 \
  localabstract:webview_devtools_remote_17116
```

Do not use:

```text
localabstract:@webview_devtools_remote_17116
```

Verify the forwarding rule:

```bash
adb forward --list
```

Expected output:

```text
emulator-5554 tcp:9222 localabstract:webview_devtools_remote_17116
```

---

## Verify the Chrome DevTools Protocol endpoint

Check the WebView runtime:

```bash
curl http://localhost:9222/json/version
```

Example response:

```json
{
  "Android-Package": "com.lfp.webviewlab",
  "Browser": "Chrome/151.0.7922.169",
  "Protocol-Version": "1.3"
}
```

Then list the available pages:

```bash
curl http://localhost:9222/json
```

The WebView should appear:

```json
{
  "title": "Mobile WebView Engineering Lab",
  "type": "page",
  "url": "http://10.0.2.2:8080/"
}
```

At this point the WebView is successfully exposing the Chrome DevTools
Protocol.

---

## Add the forwarded target to Chrome

Instead of manually opening the `devtoolsFrontendUrl`, open:

```text
chrome://inspect/#devices
```

Enable:

```text
Discover network targets
```

Click:

```text
Configure...
```

Add:

```text
localhost:9222
```

Chrome should now show the WebView as a remote target.

Example:

```text
Mobile WebView Engineering Lab
http://10.0.2.2:8080/

inspect
```

Click `inspect`.

---

## Validate the Web Playground

Once DevTools is connected, test the playground scenarios.

### Console

Tap:

```text
Write Console Log
```

Expected result:

```text
Console test triggered from WebView Lab
```

in the DevTools Console.

---

### Network

Tap:

```text
Run API Request
```

Open:

```text
DevTools → Network
```

The request triggered by the Web Playground should appear.

---

### Storage

Tap:

```text
Save Storage
```

Inspect:

```text
DevTools → Application
```

Validate:

- localStorage
- sessionStorage

---

### JavaScript Error

Tap:

```text
Trigger JavaScript Error
```

DevTools should display:

```text
Intentional WebView Lab JavaScript error
```

in the Console.

---

## Important: the socket changes when the app process changes

The WebView DevTools socket is associated with the application's
process.

For example:

```text
Application PID
        ↓
17116
        ↓
webview_devtools_remote_17116
```

If the application is:

- force stopped
- reinstalled
- restarted
- rebuilt

the PID may change.

An existing forwarding rule can therefore become invalid.

If:

```bash
curl http://localhost:9222/json
```

returns:

```text
Empty reply from server
```

rediscover the current PID:

```bash
adb shell pidof com.lfp.webviewlab
```

and socket:

```bash
adb shell cat /proc/net/unix | grep webview_devtools
```

Then recreate the forwarding rule.

---

## Troubleshooting flow

```text
WebView not visible in chrome://inspect
                │
                ▼
          adb devices
                │
                ▼
      Is emulator visible?
                │
               Yes
                ▼
 /proc/net/unix | grep webview_devtools
                │
                ▼
      Is DevTools socket present?
                │
               Yes
                ▼
        adb forward tcp:9222
                │
                ▼
      curl localhost:9222/json
                │
                ▼
        Is target returned?
                │
               Yes
                ▼
 chrome://inspect → Network Targets
                │
                ▼
          localhost:9222
                │
                ▼
            Inspect
```

---

## Architecture of the debugging connection

```text
Android Application
        │
        ▼
Android WebView
        │
        ▼
Chrome DevTools Protocol
        │
        ▼
webview_devtools_remote_<PID>
        │
        ▼
ADB
        │
        ▼
tcp:9222
        │
        ▼
localhost:9222
        │
        ▼
Chrome DevTools
```

This flow is useful when automatic WebView discovery through
`chrome://inspect` is unavailable or unreliable.

### Chrome Incognito limitation

If the WebView target does not appear in `chrome://inspect`,
make sure Chrome is running in a regular browsing window.

The DevTools target discovery flow may not work correctly from an
Incognito window.

Use:

```text
Regular Chrome window
→ chrome://inspect/#devices
→ Discover network targets
→ localhost:9222