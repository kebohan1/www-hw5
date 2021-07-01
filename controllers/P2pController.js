// const io = require('socket.io')(server);
let firebase = require("firebase/app");

exports.show = function (req, res, next) {
    let MessageRef = firebase.database().ref('message/')
    let message = Array();
    MessageRef.once('value', (snapshot) => {
        console.log(snapshot.val());
        if (snapshot.val() != null) {
            snapshot.forEach((childSnapshot) => {
                var childData = childSnapshot.val();

                if ((childData.from == req.params.username && childData.to == req.session.username)
                    || (childData.from == req.session.username && childData.to == req.params.username)) {
                    message.push(childData);
                }


                // ...
            });
        }
        console.log(message);
    }).then(() => {
        res.render('p2p', { target: req.params.username, message: message });
    });

}
exports.random = function(req,res,next){
    res.render('random');

}