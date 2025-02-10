function injectScript(file_path, tag) {
  var node = document.getElementsByTagName(tag)[0];
  var script = document.createElement("script");
  script.setAttribute("type", "text/javascript");
  script.setAttribute("src", file_path);
  node.appendChild(script);
}

// Inject local CryptoJS library
injectScript(chrome.runtime.getURL("crypto-js.min.js"), "body");
injectScript(chrome.runtime.getURL("forge.min.js"), "body");

// Inject content.js
injectScript(chrome.runtime.getURL("content.js"), "body");
