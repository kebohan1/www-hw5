let User = require('../models/User');
let async = require('async');
let firebase = require('firebase/app');
let bcrypt = require('bcrypt');
const e = require('express');
exports.show = function (req, res) {
    let UserRef = firebase.database().ref('users/' + req.session.username+'/friends/')
    let friends;
    UserRef.once('value', snapshot => {
        console.log(snapshot.val());
        friends = snapshot.val();
    }).then(() => {
        res.render('index', { username : req.session.username, friends : friends});
    });
    
}
