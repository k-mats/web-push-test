const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const webpush = require('web-push');
const cors = require('cors')({ origin: true });

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   response.send("Hello from Firebase!");
// });

exports.addMessage = functions.https.onRequest((req, res) => {
  const original = req.query.text;
  return admin.database().ref('/messages').push({original: original}).then((snapshot) => {
    return res.redirect(303, snapshot.ref.toString());
  });
});

exports.makeUpperCase = functions.database.ref('/messages/{pushId}/original').onCreate((snapshot, context) => {
  const original = snapshot.val();
  console.log('Uppercasing', context.params.pushId, original);
  const uppercase = original.toUpperCase();
  return snapshot.ref.parent.child('uppercase').set(uppercase);
});

exports.pushMessage = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    console.log("cors");
    const mailto = 'mailto:foo@example.com';
    const vapidPublicKey = 'BBnmdLvWIW0yMvUk27Qy8wAz61IRq0VrVMyEVl2zl8pEtsM8hfPRGDWplllkr27SRToM0IvZ8ta5y-SjnAStrnQ';
    const vapidPrivateKey = 'YOUR PRIVATE KEY';
    webpush.setVapidDetails(mailto, vapidPublicKey, vapidPrivateKey);
    admin.database().ref('/subscriptions').once('value').then((subscriptions) => {
      console.log('subscriptions');
      subscriptions.forEach((sub) => {
        let pushConfig = {
          endpoint: sub.val().endpoint,
          keys: {
            auth: sub.val().keys.auth,
            p256dh: sub.val().keys.p256dh
          }
        };
        let options = {
          title: req.query.title,
          content: req.query.content,
          url: req.query.url
        };
        console.log(pushConfig);
        console.log(options);
        webpush.sendNotification(pushConfig, JSON.stringify(options)).catch((error) => {
          console.log(error);
        });
      });
      res.status(201).json({message: 'Data stored'});
    });
  });
});
