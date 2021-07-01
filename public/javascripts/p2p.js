$(document).ready(function () {
    var socket = io();
    var MessageBtn = $('#send-message');
    var $frmNick = $('#setNick');
    var $nickError = $('#nickError');
    var $nickBox = $('#txtNickname');
    var $boxMessage = $('#message-input');
    var $chat = $('#message_content');
    var message_to = $('#message-to').val();
    let username;
    socket.emit('handshake', "hi");
    socket.on('connection', function (data) {
        console.log(data)
        username = data.username;
    })

    MessageBtn.click(function (e) {
        let message = $boxMessage.val().trim();
        message = {
            content: $boxMessage.val().trim(),
            to: message_to
        }
        socket.emit("private message", message);
        $boxMessage.val('');
    });
    $('#message-input').keypress(function (e) {

        code = (e.keyCode ? e.keyCode : e.which);

        if (code == 13) {
            let message = $boxMessage.val().trim();
            message = {
                content: $boxMessage.val().trim(),
                to: message_to
            }
            socket.emit("private message", message);
            $boxMessage.val('');


        }
    });
    socket.on('chat', function (server, msg) {

        var now = new Date();
        var datetime = now.getFullYear() + '/' + (now.getMonth() + 1) + '/' + now.getDate();
        datetime += ' ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();

        $chat.append("<br /><i>系統訊息: <b>[ " + msg + " ]</b> (" +
            datetime + ")</i><br />");
    });


    socket.on('private message', function (data) {
        console.log(data, username)
        var msg = data.msg.content;
        var from = data.msg.from;
        let to = data.msg.to;
        var now = new Date();
        var datetime = now.getFullYear() + '/' + (now.getMonth() + 1) + '/' + now.getDate();
        datetime += ' ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
        console.log(from, username)
        if (username.localeCompare(to) === 0) {


            $chat.append('<div class="direct-chat-msg"><div class="direct-chat-infos clearfix"><span class="direct-chat-name float-left">'
                + from + '</span><span class="direct-chat-timestamp float-right">' + datetime + '</span></div>'
                + '<div class="direct-chat-text">' + msg + '</div></div>'
            );
        } else if (username.localeCompare(from) === 0) {
            $chat.append('<div class="direct-chat-msg right"><div class="direct-chat-infos clearfix"><span class="direct-chat-name float-left">'
                + from + '</span><span class="direct-chat-timestamp float-right">' + datetime + '</span></div>'
                + '<div class="direct-chat-text">' + msg + '</div></div>'
            );
        }

    });

})