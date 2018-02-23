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
    if(new_restaurant){
        database.ref('restaurants').push(new_restaurant).then(()=>{
            console.log('Inserted new restuarant')
        })
    }
    res.send("Done")
})

// Distance Function
function distance(lat1, lon1, lat2, lon2) 
{
    var R = 6371; // km
  var dLat = toRad(lat2-lat1);
  var dLon = toRad(lon2-lon1);
  var lat1 = toRad(lat1);
  var lat2 = toRad(lat2);

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c;
  return d;
}

// Converts numeric degrees to radians
function toRad(Value) 
{
    return Value * Math.PI / 180;
}
