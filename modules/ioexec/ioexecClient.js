if(Meteor.isClient){
    $(document).ready(function(){
        Modernizr.load({load:window.location.protocol+"//"+window.location.hostname+":3100"+'/socket.io/socket.io.js', complete:function(){
            var socket = io.connect(window.location.hostname+":3100");
             socket.on('msg', function (data) {
                console.log(data)
             });             
        }});
    });
}
