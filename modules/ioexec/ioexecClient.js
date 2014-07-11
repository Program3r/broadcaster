if(Meteor.isClient){
    $(document).ready(function(){
        Modernizr.load({load:window.location.protocol+"//"+window.location.hostname+":3100"+'/socket.io/socket.io.js', complete:function(){

            var socket = io.connect(window.location.hostname+":3100");
             socket.on('ffmpeg', function (data) {
                $("#status ul").append("<li>"+data.line+"</li>");
                if(data.status == "ended"){
                    if(Session.get('repeat')){
                        $(".encode").removeClass("btn-success");
            $(".encode").addClass("btn-danger");
            $(".encode").addClass("disabled");
            $(".clearplaylist").addClass("disabled");


            function setNextDelay() {
                function fm(n) {
                    return n < 10 ? '0' + n : '' + n;
                }
                var now = new Date().getTime();
                var inthefuture = new Date();
                var starttime = $("#autostarttime").val();
                var timesplit = starttime.split(":");

                inthefuture.setHours(timesplit[0]);
                inthefuture.setMinutes(timesplit[1]);
                inthefuture.setSeconds(timesplit[2]);

                var futurems = inthefuture.getTime() - now;

                setTimeout(function () {
                    go();
                }, futurems);
            }


            function go() {
                var options = [];
                $("#playlists .playlistcontainer .exp-item").each(function () {
                    var thiss = $(this);
                    options.push({
                        _id: thiss.attr('id'),
                        duration: thiss.attr('data-duration'),
                        filename: thiss.attr('data-filename'),
                        path: thiss.attr('data-path')
                    });
                });
                Meteor.call('encode', options);
            }

            if ($("#autostarttime").val() > "") {
                setNextDelay();
            }
            else {
                go();
            }

                    }
                }
                $('#status ul').stop().animate({
                  scrollTop: $("#status ul")[0].scrollHeight
                }, 800);
                if(data.line == "ffmpeg version N-54510-gdc2a13a-syslint Copyright (c) 2000-2013 the FFmpeg developers"){
                    $("#playlists").find(".icon-play").removeClass('icon-play');
                    $("#"+data.sock.file._id).find('.icon-film').addClass('icon-play');
                    var fullduration = data.sock.file.duration;
                    var hrs = parseInt(fullduration.split(":")[0]);
                    var min = parseInt(fullduration.split(":")[1]);
                    var sec = parseInt(fullduration.split(":")[2].toString().split(".")[0])+1;
                    var ms = ((sec+(min*60)+(hrs*60*60))*1000);
                    var time = 0;
                    for(k=0;k<sec;k++){
                        setTimeout(function(o){
                            $("#progress .bar").attr('style', 'width:'+(100 / (ms / 1000))*o + '%');
                        }, k*1000, k);
                    }
                }else if(data.status == "exited"){
                    $("#progress .bar").attr('style', 'width:100%');
                }else if(data.status == "closed"){
                    $("#progress .bar").attr('style', 'width:0%');
                }else if(data.status == "ended"){
                    $("#progress .bar").attr('style', 'width:0%');
                    $("#playlists").find(".icon-play").removeClass('icon-play');
                    $("#playlists").find(".encode").removeClass('disabled').addClass('btn-success').removeClass('btn-danger');
                    $("#playlists").find(".clearplaylist").removeClass('disabled');

                }
             });


        }});
    });
}
