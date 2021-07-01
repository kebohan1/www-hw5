let firebase = require("firebase/app");
const bcrypt = require('bcrypt');
let async = require('async');
const saltRounds = 10;
let User = class {
    // getAll: (cb) => {
    //     let UsersRef = db.database().ref('users');
    //     UsersRef.on('value',(snapshot) =>{
    //         console.log(snapshot)
    //     })
    // },
    // constructor(username){
    //     if(setUser(username)==false){
    //         return undefined;
    //     }
    // }

    constructor() {
    }

    newUser(username, password) {
        console.log("Username:" + username + ",passowrd" + password);
        this.username = username;
        let hash = bcrypt.hashSync(password, 10);
        this.password = hash;
        // bcrypt.hash(password, saltRounds).then(function(hash) {
        //     this.password = hash;
        // });
        console.log("Password:" + this.password)
        let UserRef = firebase.database().ref('users/' + username)
        
        
        UserRef.set({
            username: username,
            password: this.password
        });

        
        this.password = password;
    }

    //set from firebase
    setUser(username) {
        this.username = username;
        
        // return result;
        
    }

    validatePassword(password) {
        console.log(this.password)
        let encryptedPassword = this.password;
        let result;
        bcrypt.compare(password, encryptedPassword).then(function(result) {
            return result;
        })
    }

}
module.exports = User;