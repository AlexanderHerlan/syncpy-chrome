chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
	if (request.connected == "true") {
		chrome.browserAction.setIcon({path: "images/icon19.png"});
	} else {
		chrome.browserAction.setIcon({path: "images/icon19-disabled.png"});
	}
});