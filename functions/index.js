const functions = require('firebase-functions');
const express = require('express');
const engines = require('consolidate');
const firebase = require('firebase-admin');

const firebaseApp = firebase.initializeApp(functions.config().firebase);

const app = express();
//app.engine('hbs', engines.handlebars);
app.set('views', './views');
app.set('view engine', 'vash');

function getUsersFromDB() {
    return firebaseApp.firestore().collection('users').get();
}

app.get('/:user/', (req, res) => {
    try {
        var user = null;
        var users = [];
        getUsersFromDB().then(d => {
            d.forEach(u => {
                var doc = u.data();
                users.push(doc);
                console.log(doc.name, "==",req.params["user"])
                if(doc.name === req.params["user"]) user = doc;
            })
            var dto = {
                user: user,
                users: users
            }
            console.log(dto);
            console.log("2")
            return res.render('index', dto );
        }).catch(err => {
            return res.send("oops something went wrong" + err)
        });
    } catch (err) {
        return res.send("oops something went wrong")
    }
})

exports.app = functions.https.onRequest(app);

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
