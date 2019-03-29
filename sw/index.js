"use strict";
self.addEventListener("notificationclick", (event) => {
    const notification = event.notification;
    event.waitUntil(self.clients.matchAll().then(clis => {
        const client = clis.find(cli => cli &&
            cli instanceof WindowClient &&
            cli.visibilityState === "visible");
        const url = notification.data.url;
        if (client instanceof WindowClient) {
            client.navigate(url);
            client.focus();
        }
        else {
            self.clients.openWindow(url);
        }
        notification.close();
    }));
});
self.addEventListener("push", (event) => {
    console.log("Push Notification received", event);
    let data = {
        title: "New!",
        content: "Something new happend!",
        url: "https://google.com"
    };
    if (event.data) {
        data = JSON.parse(event.data.text());
    }
    const options = {
        body: data.content,
        data: {
            url: data.url
        }
    };
    console.log(data.url);
    console.log(options.data.url);
    event.waitUntil(self.registration.showNotification(data.title, options));
});
//# sourceMappingURL=index.js.map