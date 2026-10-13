console.log("Mobile WebView Engineering Lab script loaded");

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM ready");

  const consoleButton =
    document.getElementById("consoleButton");

  const requestButton =
    document.getElementById("requestButton");

  const saveStorageButton =
    document.getElementById("saveStorageButton");

  const readStorageButton =
    document.getElementById("readStorageButton");

  const errorButton =
    document.getElementById("errorButton");

  const networkResult =
    document.getElementById("networkResult");

  const storageResult =
    document.getElementById("storageResult");

  const nativeBridgeButton =
    document.getElementById("nativeBridgeButton");

  const nativeBridgeResult =
    document.getElementById("nativeBridgeResult");


  // Console

  if (consoleButton) {
    consoleButton.addEventListener("click", () => {
      console.log(
        "Console test triggered from WebView Lab"
      );
    });
  } else {
    console.warn("consoleButton was not found");
  }


  // Network

  if (requestButton && networkResult) {
    requestButton.addEventListener("click", async () => {
      networkResult.textContent = "Loading...";

      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/posts/1"
        );

        const data = await response.json();

        console.log("API response:", data);

        networkResult.textContent =
          JSON.stringify(data, null, 2);

      } catch (error) {
        console.error(
          "API request failed:",
          error
        );

        networkResult.textContent =
          `Error: ${error.message}`;
      }
    });
  } else {
    console.warn(
      "Network test elements were not found"
    );
  }


  // Storage

  if (saveStorageButton) {
    saveStorageButton.addEventListener("click", () => {
      localStorage.setItem(
        "webview-lab-local",
        "local-storage-value"
      );

      sessionStorage.setItem(
        "webview-lab-session",
        "session-storage-value"
      );

      console.log("Storage values saved");
    });
  } else {
    console.warn(
      "saveStorageButton was not found"
    );
  }


  if (readStorageButton && storageResult) {
    readStorageButton.addEventListener("click", () => {
      const localValue =
        localStorage.getItem(
          "webview-lab-local"
        );

      const sessionValue =
        sessionStorage.getItem(
          "webview-lab-session"
        );

      const result = {
        localStorage: localValue,
        sessionStorage: sessionValue
      };

      console.log(
        "Storage values:",
        result
      );

      storageResult.textContent =
        JSON.stringify(result, null, 2);
    });
  } else {
    console.warn(
      "Storage read elements were not found"
    );
  }


  // Intentional JavaScript error

  if (errorButton) {
    errorButton.addEventListener("click", () => {
      console.log(
        "Triggering intentional JavaScript error"
      );

      throw new Error(
        "Intentional WebView Lab JavaScript error"
      );
    });
  } else {
    console.warn("errorButton was not found");
  }


  // JavaScript → Native Bridge

  if (
    nativeBridgeButton &&
    nativeBridgeResult
  ) {
    nativeBridgeButton.addEventListener(
      "click",
      () => {
        const message =
          "Hello from JavaScript";

        console.log(
          "Sending message to native layer"
        );

        // Android
        if (window.AndroidBridge) {
          window.AndroidBridge.sendMessage(
            message
          );

          nativeBridgeResult.textContent =
            "Message sent to Android";

          return;
        }

        // iOS
        if (
          window.webkit &&
          window.webkit.messageHandlers &&
          window.webkit.messageHandlers.NativeBridge
        ) {
          window.webkit
            .messageHandlers
            .NativeBridge
            .postMessage(message);

          nativeBridgeResult.textContent =
            "Message sent to iOS";

          return;
        }

        console.warn(
          "Native bridge is not available"
        );

        nativeBridgeResult.textContent =
          "Native bridge is not available";
      }
    );
  } else {
    console.warn(
      "Native bridge elements were not found"
    );
  }

  console.log(
    "WebView Lab event handlers registered"
  );
});