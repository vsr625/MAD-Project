const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const database = admin.database()
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.addrest = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
 database.ref('/').set({
     'name': 'name'
 })
});
