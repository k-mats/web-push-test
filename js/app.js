"use strict";
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').then(() => {
        console.log('Service worker registered!');
    }).catch(error => {
        console.log(error);
    });
}
if ('Notification' in window && 'serviceWorker' in navigator) {
    const permissionButton = document.querySelector('.permission-button');
    if (permissionButton) {
        permissionButton.addEventListener('click', askForNotificationPermission);
    }
    const pushButton = document.querySelector('.push-button');
    if (pushButton) {
        pushButton.addEventListener('click', pushNotification);
    }
}
function configurePushSub() {
    if (!('serviceWorker' in navigator)) {
        return;
    }
    let reg;
    navigator.serviceWorker.ready.then((swreg) => {
        reg = swreg;
        return swreg.pushManager.getSubscription();
    }).then(sub => {
        if (sub === null) {
            // Create a new subscription
            const vapidPublicKey = 'BBnmdLvWIW0yMvUk27Qy8wAz61IRq0VrVMyEVl2zl8pEtsM8hfPRGDWplllkr27SRToM0IvZ8ta5y-SjnAStrnQ';
            const convertedVapidPublicKey = urlBase64ToUint8Array(vapidPublicKey);
            reg.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: convertedVapidPublicKey
            }).then(newSub => {
                return fetch('FCM URL 1', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(newSub)
                });
            });
        }
        else {
            // We already have a subscription
        }
    }).catch(error => {
        console.log(error);
    });
}
function askForNotificationPermission() {
    Notification.requestPermission(result => {
        console.log('User choice', result);
        if (result === 'granted') {
            configurePushSub();
        }
        else {
            console.log('No notification permission granted!');
        }
    });
}
function pushNotification() {
    fetch('FCM URL 2');
}
//# sourceMappingURL=app.js.map