$(document).ready(function () {
    var socket = io();
    var MessageBtn = $('#send-message');
    var $frmNick = $('#setNick');
    var $nickError = $('#nickError');
    var $nickBox = $('#txtNickname');
    var $boxMessage = $('#message-input');
    var $chat = $('#message_content');
    var message_to;
    let username;
    let get_invite = false;
    socket.emit('handshake', "hi");
    socket.on('connection', function (data) {
        console.log(data)
        username = data.username;
    })

    socket.emit('looking pair', "hi");
    // socket.on('looking pair',function (data) {
        
    // })

    socket.on('paired',function (data) {
        if(data.to==username){
            message_to=data.target
            $('#system_progress').html(message_to+' has joined the chat room');
        }
        
    })

    MessageBtn.click(function (e) {
        let message = $boxMessage.val().trim();
        message = {
            content: $boxMessage.val().trim(),
            to: message_to
        }
        socket.emit("random message", message);
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
            socket.emit("random message", message);
            $boxMessage.val('');


        }
    });

    $('#rematch_btn').on('click', function(){
        socket.emit('random_disconnect',{username:message_to});
        socket.emit('looking pair', "hi");
        $('#system_progress').html('Pairing in progress');
        $('#message_content').html('');

        
    })
    socket.on('random_disconnect',function (data){
        if(data.to==username&&data.from==message_to){
            // $('#system_progress').html(message_to+' has joined the chat room');
            $chat.append('<div class="direct-chat-msg right"><div class="direct-chat-infos clearfix"><span class="direct-chat-name float-left">'
                + message_to + '</span><span class="direct-chat-timestamp float-right"></span></div>'
                + '<div class="direct-chat-text"> disconnected </div></div>'
            );
        }
    })


    socket.on('random message', function (data) {
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

    $('#invite_btn').click(function(){
        var now = new Date();
        var datetime = now.getFullYear() + '/' + (now.getMonth() + 1) + '/' + now.getDate();
        datetime += ' ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
        $('#invite_btn').prop('disabled', true);
        
        $chat.append('<div class="direct-chat-msg right"><div class="direct-chat-infos clearfix"><span class="direct-chat-name float-left">'+username+'</span><span class="direct-chat-timestamp float-right">' + datetime + '</span></div>'
                + '<div class="direct-chat-text">You are inviting '+message_to+' to be your friend</div></div>'
            );
            if(get_invite==false){
                socket.emit('invite',{username:message_to})
            } else {
                socket.emit('res_invite',{from:username,to:message_to})

            }
        
    })
    socket.on('res_invite',function(data){
        var now = new Date();
        var datetime = now.getFullYear() + '/' + (now.getMonth() + 1) + '/' + now.getDate();
        datetime += ' ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
        console.log(data)
        if(data.to==username){
            $chat.append('<div class="direct-chat-msg"><div class="direct-chat-infos clearfix"><span class="direct-chat-name float-left">'+data.from+'</span><span class="direct-chat-timestamp float-right">' + datetime + '</span></div>'
                + '<div class="direct-chat-text">'+data.from+' is inviting you to become a friend</div></div>'
            );
        }
        $chat.append('<div class="direct-chat-msg"><div class="direct-chat-infos clearfix"><span class="direct-chat-name float-left">System</span><span class="direct-chat-timestamp float-right">' + datetime + '</span></div>'
                + '<div class="direct-chat-text">Congratulation on becoming a friend</div></div>'
            );
    });

    socket.on('invite',function(data){
        var now = new Date();
        var datetime = now.getFullYear() + '/' + (now.getMonth() + 1) + '/' + now.getDate();
        datetime += ' ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
        if(data.to==username){
            $chat.append('<div class="direct-chat-msg"><div class="direct-chat-infos clearfix"><span class="direct-chat-name float-left">'+data.from+'</span><span class="direct-chat-timestamp float-right">' + datetime + '</span></div>'
                + '<div class="direct-chat-text">'+data.from+' is inviting you to become a friend</div></div>'
            );
            get_invite=true;
        }
    })
})