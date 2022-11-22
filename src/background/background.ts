chrome.action.onClicked.addListener((tab:any) => {
    chrome.scripting.executeScript({
      target: {tabId: tab.id},
      files: ['contentScript.js']
    });
});


chrome.runtime.onMessage.addListener((message) => {
  if(message === "set-response") {
    chrome.storage.sync.get(['violations'], (res) => {
      const object = res.violations.data.sensitivity;
      const sum = Object.values(object).reduce((a:any, b:any) => parseInt(a) + parseInt(b));
      chrome.action.setBadgeText({
        text: sum+"",
      });
      chrome.action.setBadgeBackgroundColor({
        color: "#7059fb"
      });
    });
  }
});