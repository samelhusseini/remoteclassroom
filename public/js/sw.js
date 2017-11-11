// Version 0.1
let version = '0.1';


self.addEventListener('activate',  event => {
  event.waitUntil(self.clients.claim());
});