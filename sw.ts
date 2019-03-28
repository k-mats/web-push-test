self.addEventListener('notificationclick', (event: NotificationEvent) => {
    const notification = event.notification

    event.waitUntil(
        clients.matchAll().then(clis => {
            const client = clis.find(cli => {
                return cli.visibilityState === 'visible'
            })

            const url = notification.data.url
            if (client !== undefined) {
                client.navigate(url)
                client.focus()
            } else {
                clients.openWindow(url);
            }
            notification.close()
        })
    )
})

self.addEventListener('push', event => {
    console.log('Push Notification received', event)

    let data = {title: 'New!', contnet: 'Something new happend!', url: 'https://google.com'};
    if (event.data) {
        data = JSON.parse(event.data.text())
    }
    const options = {
        body: data.content,
        data: {
            url: data.url
        }
    }
    console.log(data.url)
    console.log(options.data.url)

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    )
})

interface NotificationEvent extends ExtendableEvent {
    readonly action: string;
    readonly notification: Notification;
}
