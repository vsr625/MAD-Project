const functions = require('firebase-functions')
const admin = require('firebase-admin')
const Math = require('mathjs')

// Configuring firebase
admin.initializeApp(functions.config().firebase)
const database = admin.database()

// Apis start from here

// Add restaurant
exports.addrest = functions.https.onRequest((req, res) => {
    var new_restaurant = req.param('restaurant')
    console.log(new_restaurant)
    if (new_restaurant) {
        database.ref('restaurants').push(new_restaurant).then(() => {
            console.log('Inserted new restuarant')
        })
        res.send("Done")
    } else {
        res.send("Invalid request")
    }

})

// Distance Function
function distance(lat1, lon1, lat2, lon2) {
    var R = 6371 // km
    var dLat = toRad(lat2 - lat1)
    var dLon = toRad(lon2 - lon1)
    var lat1 = toRad(lat1)
    var lat2 = toRad(lat2)

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2)
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    var d = R * c
    return d
}

// Converts numeric degrees to radians
function toRad(Value) {
    return Value * Math.PI / 180
}

// Get list of nearby restaurants
exports.getrest = functions.https.onRequest((req, res) => {
    var list_of_res;
    const curr_lat = req.param('gps-lat'),
        curr_long = req.param('gps-long'),
        curr_time = req.param('curr-time')
    if (curr_lat && curr_long && curr_time) {
        database.ref('restaurants').once('value', (snapshot) => {
            const arr = [];
            snapshot.forEach((childSnapshot) => {
                var lat = childSnapshot.val()["gps-lat"],
                    long = childSnapshot.val()["gps-long"],
                    open_time = childSnapshot.val()["open-time"],
                    close_time = childSnapshot.val()["close-time"]
                console.log(distance(curr_lat, curr_long, lat, long))
                if (distance(curr_lat, curr_long, lat, long) < 5 && curr_time >= open_time && curr_time <= close_time) {
                    arr.push({
                        'id': childSnapshot.key,
                        'name': childSnapshot.val()["name"],
                        'open-time': childSnapshot.val()['open-time'],
                        'close-time': childSnapshot.val()['close-time']
                    })
                }
            })
            list_of_res = arr
        }).then(() => {
            res.send(list_of_res)
        })
    } else {
        res.send("Invalid request")
    }
})

exports.getdetails = functions.https.onRequest((req, res)=>{
    var rest_id = req.param('rest-id')
    var result
    if(rest_id){
        database.ref('/').child('restaurants').child(rest_id).once('value', (snapshot) =>{
            result = snapshot.val()
            result.id = snapshot.key
            console.log(result)
        }).then(()=>{
            res.send(result)
        })
    }else{
        res.send("Invalid request")//hjfdsgljkjgskjhgks
    }
})
