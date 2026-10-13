console.log("Mobile WebView Engineering Lab loaded");

const consoleButton = document.getElementById("consoleButton");
const requestButton = document.getElementById("requestButton");
const saveStorageButton = document.getElementById("saveStorageButton");
const readStorageButton = document.getElementById("readStorageButton");
const errorButton = document.getElementById("errorButton");

const networkResult = document.getElementById("networkResult");
const storageResult = document.getElementById("storageResult");

const nativeBridgeButton =
  document.getElementById("nativeBridgeButton");

const nativeBridgeResult =
  document.getElementById("nativeBridgeResult");

nativeBridgeButton.addEventListener("click", () => {
  console.log("Sending message to Android native layer");

  if (window.AndroidBridge) {
    window.AndroidBridge.sendMessage(
      "Hello from JavaScript"
    );

    nativeBridgeResult.textContent =
      "Message sent to Android";
  } else {
    console.warn("AndroidBridge is not available");

    nativeBridgeResult.textContent =
      "Native bridge is not available";
  }
});

consoleButton.addEventListener("click", () => {
  console.log("Console test triggered from WebView Lab");
});

requestButton.addEventListener("click", async () => {
  networkResult.textContent = "Loading...";

  try {
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/posts/1"
    );

    const data = await response.json();

    console.log("API response:", data);

    networkResult.textContent = JSON.stringify(data, null, 2);
  } catch (error) {
    console.error("API request failed:", error);
    networkResult.textContent = `Error: ${error.message}`;
  }
});

saveStorageButton.addEventListener("click", () => {
  localStorage.setItem("webview-lab-local", "local-storage-value");

  sessionStorage.setItem(
    "webview-lab-session",
    "session-storage-value"
  );

  console.log("Storage values saved");
});

readStorageButton.addEventListener("click", () => {
  const localValue = localStorage.getItem("webview-lab-local");
  const sessionValue = sessionStorage.getItem("webview-lab-session");

  const result = {
    localStorage: localValue,
    sessionStorage: sessionValue
  };

  console.log("Storage values:", result);

  storageResult.textContent = JSON.stringify(result, null, 2);
});

errorButton.addEventListener("click", () => {
  console.log("Triggering intentional JavaScript error");

  throw new Error(
    "Intentional WebView Lab JavaScript error"
  );
});