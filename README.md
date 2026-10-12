# Mobile WebView Engineering Lab

A hands-on Android and iOS lab for exploring how embedded web experiences behave inside real mobile applications.

The project compares **Android WebView** and **iOS WKWebView** side by side, with practical scenarios for debugging, JavaScript ↔ Native communication, navigation, storage, file handling, security, and testing.

> The goal is not to build a production app. It is to create a small, reproducible engineering lab where WebView behavior can be inspected, tested, recorded, and documented on both platforms.

## Project Status

🚧 **In development**

Current milestone: **repository setup and Web Playground foundation**

## What this lab will cover

- WebView setup on Android and iOS
- Chrome DevTools inspection with `chrome://inspect`
- Safari Web Inspector for `WKWebView`
- Console, Network, DOM, and Storage inspection
- JavaScript ↔ Native bridges
- Navigation interception
- Cookies, `localStorage`, and `sessionStorage`
- File and media upload
- External links and deep-link handling
- Error and offline scenarios
- WebView security considerations
- Platform-specific automated tests
- Short demo scenarios for documentation and technical content

## Platforms

| Platform | Stack | WebView |
| --- | --- | --- |
| Android | Kotlin + Jetpack Compose | `android.webkit.WebView` |
| iOS | Swift + SwiftUI | `WKWebView` |
| Web Playground | HTML + CSS + JavaScript | Shared test content |

## Repository Structure

```text
mobile-webview-engineering-lab/
├── android/   # Android WebView application
├── ios/       # iOS WKWebView application
├── web/       # Shared Web Playground used by both apps
├── docs/      # Architecture, debugging, security, and testing notes
├── media/     # Screenshots and demo assets
├── scripts/   # Local development and test helpers
└── README.md
```

## Why this project exists

Debugging a hybrid flow requires visibility into both sides of the application.

Native tooling such as Xcode and Android Studio explains what the mobile application is doing, while browser inspection tools expose what is happening inside the embedded web runtime.

This lab is designed to make that boundary visible:

```text
Web Content
    ↓
WebView Runtime
    ↓
JavaScript ↔ Native Bridge
    ↓
Native Mobile Application
    ↓
APIs / Platform Services
```

A core idea behind the project is:

> **Native logs only tell half the story when the problem lives inside a WebView.**

## Planned Debugging Flow

### Android

```text
Android WebView
    ↓
chrome://inspect
    ↓
Chrome DevTools
    ↓
Console / Network / DOM / Storage
```

### iOS

```text
WKWebView
    ↓
Safari → Develop → Simulator / Device
    ↓
Safari Web Inspector
    ↓
Console / Network / DOM / Storage
```

## Development Roadmap

The project will evolve incrementally.

### v0.1 — WebView Inspection

- [ ] Shared Web Playground
- [ ] Android WebView
- [ ] iOS WKWebView
- [ ] Chrome DevTools inspection
- [ ] Safari Web Inspector
- [ ] Console and Network scenarios
- [ ] First Android and iOS demo recordings

### v0.2 — JavaScript ↔ Native Bridge

- [ ] JavaScript → Kotlin
- [ ] JavaScript → Swift
- [ ] Native → JavaScript
- [ ] Bridge debugging scenarios

### v0.3 — Storage and Session

- [ ] Cookies
- [ ] `localStorage`
- [ ] `sessionStorage`
- [ ] Persistence scenarios

### v0.4 — File Handling

- [ ] Image upload
- [ ] Video upload
- [ ] External file picker
- [ ] Platform comparison

### v0.5 — Security and Testing

- [ ] Navigation restrictions
- [ ] Debug-only inspection configuration
- [ ] JavaScript bridge safety
- [ ] Android tests
- [ ] iOS tests
- [ ] Security documentation

## Documentation

Detailed notes will live under `docs/` as each scenario is implemented.

Planned topics:

- WebView architecture
- Android and iOS inspection
- JavaScript bridges
- Cookies and storage
- File handling
- Security
- Testing
- Platform differences

## Demo Scenarios

The project will include short, reproducible scenarios intended for both engineering validation and screen recording.

Examples:

- Inspecting an API request from inside a WebView
- Finding a JavaScript error that does not appear in native logs
- Inspecting cookies and browser storage
- Sending an event from JavaScript to native code
- Uploading a video through a WebView file input
- Comparing the same flow on Android and iOS

## License

License information will be added as the project evolves.
