let User = require('../models/User');
let async = require('async');
let firebase = require('firebase/app');
let bcrypt = require('bcrypt');
const e = require('express');
exports.getLoginView = function (req, res) {
    res.render('user/login', { title: 'Login' });
}
exports.login = function (req, res) {
    let user = new User();
    console.log(req.body);
    let UserRef = firebase.database().ref('users/' + req.body.username)
    let encryptedPassword;
    let compareResult;
    UserRef.once('value', snapshot => {
        console.log(snapshot.val());
        if(snapshot.val()==null){
            res.render('user/login',{ title: 'Login'});
            return;
        }
        encryptedPassword = snapshot.val().password;

    }, error => {
        res.render('user/login' ,{ title: 'Login'});
        return;
    }).then(() => {
        compareResult = bcrypt.compareSync(req.body.password, encryptedPassword);
        if (compareResult != false) {
            req.session.username = req.body.username;
            res.redirect('/');
        } else {
            res.render('user/login',{ title: 'Login'});
        }
    });
    
    // // req.session.username = req.body.username;
    // // req.session.email = req.body.email;
    // console.log("Login succeess");
}

exports.getRegisterView = function (req, res) {
    res.render('user/signup', { title: 'Register' })
}

exports.register = function (req, res) {
    let err_msg;
    console.log(req.body.username);
    if (req.body.username != undefined && req.body.password != undefined) {
        let user = new User();
        console.log(user);
        user.newUser(req.body.username, req.body.password);
        res.redirect('/user/login');
        return;
    } else {
        err_msg = "Please input all information"
    }
    res.render('user/signup', { title: 'Register', err_msg: err_msg });
}