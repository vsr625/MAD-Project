const functions = require('firebase-functions')
const admin = require('firebase-admin')

// Configuring firebase
admin.initializeApp(functions.config().firebase)
const database = admin.database()

// Apis start from here

// Add restaurant
exports.addrest = functions.https.onRequest((request, response) => {

})
