
let express = require('express');
let path = require('path');
// let flash = require('connect-flash');//flash使用在顯示錯誤十分方便
let Session = require("express-session");
var FileStore = require('session-file-store')(Session);

let bodyParser = require('body-parser');
let logger = require('morgan');
let firebase = require("firebase/app");
require('firebase/database');
require('dotenv').config()
let app = express();
let session = Session({
    name: 'identitykey',
    resave: true,
    store: new FileStore(),
    secret: 'recommand 128 bytes random string',
    saveUninitialized: false,
    resave: true,
    cookie: {
        maxAge: 10 * 1000
    }
});
app.use(session)
var sharedsession = require("express-socket.io-session");

let firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASEURL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
};
console.log(firebaseConfig);
firebase.initializeApp(firebaseConfig);
this.firebase = firebase;

//set socket.io connection

const server = require('http').createServer(app);
const io = require('socket.io')(server);
io.use(sharedsession(session, {
    autoSave:true
}));
// io.of('/namespace').use(sharedsession(session, {
//     autoSave: true
// }));
//which port you want
const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log('Server listening at port %d', port);
});


// view engine setup
app.use('/adminlte/dist', express.static(__dirname + '/node_modules/admin-lte/dist'));
app.use('/adminlte/plugins', express.static(__dirname + '/node_modules/admin-lte/plugins'));
app.use('/socket.io/', express.static(__dirname + '/node_modules/socket.io/client-dist/'));


app.set('views', path.join(__dirname, 'views'));//將view加入路徑
app.engine('ejs', require('ejs-locals'));
app.set('view engine', 'ejs');

app.use('/public', express.static(__dirname + '/public'));
// app.use(validator());
app.use(logger('dev'));
app.use(bodyParser.json());
// app.use(session({ secret: 'mysupersecret', resave: true, saveUninitialized: true }));//set session 
// app.use(flash());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


/*set router*/
/*將路徑指到router資料夾下的user.js*/
let user = require('./routers/user');
let auth = require('./middlewares/auth');

app.use('/user', user);






/*set index  router*/
/*set firebase*/

// let firebaseDb = require('../HW5temp/connections/firebase_admin');
// let firebase = require('../HW5temp/connections/firebse_client');
const { create } = require('domain');
const indexController = require('./controllers/IndexController');
const p2pController = require('./controllers/P2pController');


app.get('/', auth, indexController.show);
// app.get('/',indexController.show);

app.get('/p2p/:username', auth, p2pController.show);

app.get('/p2p_random', auth, p2pController.random);
//建立socket io server
// io.use(async (socket, next) => {
//     const sessionID = socket.handshake.auth.sessionID;
    
//     const username = socket.handshake.auth.username;
//     console.log(username);
//     if (!username) {
//         return next(new Error("invalid username"));
//     }s
//     socket.sessionID = randomId();
//     socket.username = username;
//     next();
// });
// io.on("connection", async (socket) => {

//     // emit session details
//     socket.emit("session", {
//         sessionID: socket.sessionID,
//         username: socket.username,
//     });

//     // join the "userID" room
//     socket.join(socket.username);

//     // fetch existing users
//     const users = [];
//     const messagesPerUser = new Map();
//     messages.forEach((message) => {
//         const { from, to } = message;
//         const otherUser = socket.username === from ? to : from;
//         if (messagesPerUser.has(otherUser)) {
//             messagesPerUser.get(otherUser).push(message);
//         } else {
//             messagesPerUser.set(otherUser, [message]);
//         }
//     });

//     sessions.forEach((session) => {
//         users.push({
//             username: session.username,
//             messages: messagesPerUser.get(session.username) || [],
//         });
//     });
//     socket.emit("users", users);


//     // forward the private message to the right recipient (and to other tabs of the sender)
//     socket.on("private message", ({ content, to }) => {
//         const message = {
//             content,
//             from: socket.username,
//             to,
//         };
//         socket.to(to).to(socket.username).emit("private message", message);
//         messageStore.saveMessage(message);
//     });

//     // // notify users upon disconnection
//     // socket.on("disconnect", async () => {
//     //     const matchingSockets = await io.in(socket.userID).allSockets();
//     //     const isDisconnected = matchingSockets.size === 0;
//     //     if (isDisconnected) {
//     //         // notify other users
//     //         socket.broadcast.emit("user disconnected", socket.userID);
//     //         // update the connection status of the session
//     //         sessionStore.saveSession(socket.sessionID, {
//     //             userID: socket.userID,
//     //             username: socket.username,
//     //             connected: false,
//     //         });
//     //     }
//     // });
// });
let pairing_users = [];
let send_invite_friend = [];
io.on('connection', function (socket) {
    //
    //    console.log(socket.handshake.session.username+" is connected")
    socket.join(socket.handshake.session.username);
    socket.username = socket.handshake.session.username;
    socket.emit('connection',{
        username: socket.username
    })

    
    
    // console.log(socket.handshake.session.username)
    // socket.on('handshake', function (data){
    //     console.log(data)
    // })

    socket.on('private message', message_rec => {
        console.log(message_rec)
        let content = message_rec.content;
        let from = socket.username;
        let to = message_rec.to;
        let now = new Date();
            let datetime = now.getFullYear() + '/' + (now.getMonth() + 1) + '/' + now.getDate();
            datetime += ' ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
        const message = {
            content,
            from: from,
            to,
        };
        let MessageRef = firebase.database().ref('message/')
        MessageRef.push().set({
            content:content,
            from: from,
            to: to,
            time: datetime
        }).then(() => {
            io.emit('private message', { msg: message});
        });
        
        // socket.to(to).to(socket.username).emit("private message", message_rec);
    });

    socket.on('looking pair',function(data){
        if(pairing_users.length!=0){
            let select_user_index = Math.floor(Math.random() * pairing_users.length);
            io.emit('paired',{target: pairing_users[select_user_index],to:socket.handshake.session.username });
            io.emit('paired',{target: socket.handshake.session.username,to:pairing_users[select_user_index] });
            pairing_users.splice(select_user_index, 1);
        } else {
            pairing_users.push(socket.handshake.session.username);
            console.log(pairing_users)
        }
    })

    socket.on('random_disconnect',function (data){
        console.log(data)
        socket.emit('random_disconnect',{from:socket.handshake.session.username,to:data.username});
    }
    );
    socket.on('random message',function(message_rec){
        console.log(message_rec)
        let content = message_rec.content;
        let from = socket.username;
        let to = message_rec.to;
        let now = new Date();
            let datetime = now.getFullYear() + '/' + (now.getMonth() + 1) + '/' + now.getDate();
            datetime += ' ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
        const message = {
            content,
            from: from,
            to,
        };
        console.log(content,from,to);
        io.emit('random message', { msg: message});
    })

    socket.on('invite', function(data){
        io.emit('invite', {from:socket.handshake.session.username,to:data.username});
        send_invite_friend.push({from:socket.handshake.session.username,to:data.username});
    });

           
    socket.on('res_invite',function(data){
        console.log('res_invite_from:'+data.from)
        console.log(send_invite_friend)
        send_invite_friend.forEach(element =>{
            console.log(element.to,data.from)
            if(element.to==data.from){
                let FriendRef = firebase.database().ref('users/'+socket.username+'/friends')
                FriendRef.push().set(element.from);
                FriendRef = firebase.database().ref('users/'+element.from+'/friends')
                FriendRef.push().set(socket.username).then(()=>{
                    io.emit('res_invite', {from:data.from,to:element.from});
                });
            }
        })
    })




})




