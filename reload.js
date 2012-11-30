(function() {
   var sock = null;
   var wsuri;

   wsuri = "ws://localhost:9000";

   if ("WebSocket" in window) {
      sock = new WebSocket(wsuri);
   } else if ("MozWebSocket" in window) {
      sock = new MozWebSocket(wsuri);
   } else {
      console.log("Browser does not support WebSocket!");
   }

   if (sock) {
      sock.onopen = function() {
         console.log("Connected to " + wsuri);
         sock.send('{"handshake": "' + window.location.href + '"}');
      }

      sock.onclose = function(e) {
         //console.log("Connection closed (wasClean = " + e.wasClean + ", code = " + e.code + ", reason = '" + e.reason + "')");
         console.log("Unable to contact pysync reload server.");
         sock = null;
         chrome.extension.sendMessage({connected: "false"});
      }

      sock.onmessage = function(e) {        
         var command = JSON.parse(e.data);

         if(command.hasOwnProperty("handshake")) {
            if(command.handshake == "true") {
               chrome.extension.sendMessage({connected: "true"});
            } else {
               chrome.extension.sendMessage({connected: "false"});
            }
         } else {
            expected_website = command.refresh
            current_website = window.location.href
            current_website = current_website.substring(0,expected_website.length);
            if(expected_website == current_website) {
               window.location.reload()
               console.log("Refreshing: " + expected_website);
            }
         }
      }
   }
})();

function broadcast(msg) {
   if (sock) {
      sock.send(msg);
   }
}