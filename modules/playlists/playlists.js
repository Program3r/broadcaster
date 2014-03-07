playlistpersist = new Meteor.Collection("playlistpersist");
savedplaylists = new Meteor.Collection("saved");

encoder = new Meteor.Collection("encoder");
if(Meteor.isClient){
    Meteor.startup(function(){
        Meteor.call('reCalcTime');
    });
    Template.saveload.saved = function(){
        return savedplaylists.find();
    }
    Template.saveload.events({
       'click .save':function(){
           var saveval = $("#saveplaylisttext").val();
           if(saveval > ""){
               var saveObj = {name:saveval,playlist:playlistpersist.find().fetch()};
               savedplaylists.insert(saveObj);
               $("#saveplaylisttext").val("");
           }
       },
       'click .load':function(){
            var currentLoaded = playlistpersist.find().fetch();
            $.each(currentLoaded, function(index, val){
                playlistpersist.remove(val._id);
            })
            var loadid = $("#loadplaylist").val();
            var loadObj = savedplaylists.findOne({_id:loadid});
            $.each(loadObj.playlist, function(index, val){
                playlistpersist.insert(val);
            })
       },
       'click .remove':function(){
           var loadid = $("#loadplaylist").val();
           savedplaylists.remove(loadid);
       }
    });
    Template.playlists.rendered = function(){
       // if (!this._rendered) {
            $("#playlists").find(".playlistcontainer").sortable({
              revert:true,
              receive: function(event, ui){
                $("#playlists").find(".exp-item").each(function(){
                   $(this).css("position", "");
                   $(this).css("top", "");
                   $(this).css("left", "");
                   $(this).css("-webkit-transform", "");
                   $(this).tagName = 'li';

                   $(this).find(".removeitem").click(function(){
                      playlistpersist.remove($(this).parent().attr('id'));
                   });
               });

                Meteor.call('reCalcTime');
              },
              stop:function(event, ui){
                    $("#playlists").find(".exp-item").each(function(index){
                        var thisItem = $(this);

                        if(thisItem.hasClass('isotope-item')){
                            var data = {icon:"icon-film", order:index, filename:$(this).attr("data-filename"), duration:$(this).attr("data-duration"), path:$(this).attr("data-path"), results:$(this).attr("data-results")};
                            playlistpersist.insert(data);
                            thisItem.remove();
                        }else{
                            playlistpersist.update($(this).attr('id'), {$set:{order:index}});
                        }
                    });
                    Meteor.call('reCalcTime');
              }
            });
            //this._rendered = true;
        //}
    }
    Template.exploreritem.events({
        'click .removeitem':function(){
            playlistpersist.remove(this._id)
        }
    });
    Template.playlists.playlistitems = function(){
        var items = playlistpersist.find({}).fetch();
        return _.sortBy(items, function(item){return item.order});
    }

    //Add Function To Nav
    Template.navigation.events({
        'click addplaylist':function(){
            playlists.insert({});
        }
    });
    //Add functions to timepicker
    Template.timecontrols.rendered = function(){
        $(this.firstNode).timepicker({ 'timeFormat': 'H:i:s' });
    }
    Template.timecontrols.events({
        'click .setstart':function(){
            $("#autostarttime").toggleClass('auto-start')
        },
        'click .erase':function(){
            $("#autostarttime").val();
        }
    })
    Template.playlists.events({
        'click .encodefile':function(){
            var file = files.findOne({_id:this.fileid});

            //Meteor.call('runcommand', {command:"ffmpeg -re -i '"+file.path+"/"+file.filename+"' -vcodec libx264 -ab 128k -ac 2 -ar 44100 -r 25 -s 640x480 -vb 660k -f flv 'rtmp://"+Meteor.settings.public.rtmpuser+":"+Meteor.settings.public.rtmppass+"@"+Meteor.settings.public.rtmp+"'"}, function(err, res){
            //});
            console.log("ffmpeg -re -i '"+file.path+"/"+file.filename+"' -vcodec libx264 -ab 128k -ac 2 -ar 44100 -r 25 -s 640x480 -vb 660k -f flv 'rtmp://"+Meteor.settings.public.rtmpuser+":"+Meteor.settings.public.rtmppass+"@"+Meteor.settings.public.rtmp+"'");
        },
        'click .encode':function(){
            $(".encode").removeClass("btn-success");
            $(".encode").addClass("btn-danger");
            $(".encode").addClass("disabled");
            $(".clearplaylist").addClass("disabled");


            function go(){
                var options = [];
                $("#playlists .playlistcontainer .exp-item").each(function(){
                   var thiss = $(this);
                   options.push({_id:thiss.attr('id'),duration:thiss.attr('data-duration'), filename:thiss.attr('data-filename'), path:thiss.attr('data-path')});
                });
                Meteor.call('encode', options);
            }



            if($("#autostarttime").val() > ""){
                function fm(n){return n<10? '0'+n:''+n;}
                var now = new Date().getTime();
                var inthefuture = new Date();
                var starttime = $("#autostarttime").val();
                var timesplit = starttime.split(":");

                inthefuture.setHours(timesplit[0]);
                inthefuture.setMinutes(timesplit[1]);
                inthefuture.setSeconds(timesplit[2]);

                var futurems = inthefuture.getTime() - now;

                setTimeout(function(){go();}, futurems);

            }else{
                go();
            }




        },
        'click .clearplaylist':function(){
            $.each(playlistpersist.find().fetch(), function(){playlistpersist.remove(this._id)});
        }
    });
    Meteor.methods({
       'reCalcTime':function(){
            var date = new Date();
            $("#playlists .playlistcontainer .exp-item").each(function(){
                var duration = $(this).attr("data-duration");
                var times = duration.split(":");
                date.setSeconds(date.getSeconds()+parseInt(times[2]));
                date.setMinutes(date.getMinutes()+parseInt(times[1]));
                date.setHours(date.getHours()+parseInt(times[0]));
            });



            $("#time").text(date);




            setTimeout(function(){Meteor.call('reCalcTime');}, 1000);
       },
        'clearplaylists':function(){
            $("#playlists .playlistcontainer .exp-item").remove();
            Meteor.call('reCalcTime');
        }
    });
}

if(Meteor.isServer){
    Meteor.methods({
        'playplaylist':function(){
            var filelist = playlists.find({});
        },
        'deletefile':function(options){
            var fs = Npm.require('fs');
            fs.unlink(options.file, function (err) {
              if (err) throw err;
              console.log('successfully deleted '+options.file);
            });

        },
        'encode':function(options){

            if(Meteor.isServer){
                var encoderitems = encoder.find({}).fetch();
                for(i=0;i<encoderitems.length;i++){
                    encoder.remove(encoderitems[i]._id);
                }


                var time = 1;

                for(i=0;i<options.length;i++){
                    var theseopt = options[i];

                    encoder.insert(theseopt);
                    /*var file = theseopt.filename;
                    var fullduration = theseopt.duration;
                    var hrs = parseInt(fullduration.split(":")[0]);
                    var min = parseInt(fullduration.split(":")[1]);
                    var sec = parseInt(fullduration.split(":")[2].toString().split(".")[0])+1;
                    var ms = ((sec+(min*60)+(hrs*60*60))*1000)+6000;

                    var filepath = theseopt.path+"/"+file;
                        setTimeout(function(fpath){
                           var Fiber = Npm.require('fibers');
                            Fiber(function() {
                                //Meteor.call('remcmd', {cmd:"ffmpeg -re -i '"+fpath+"' -vcodec libx264 -ab 128k -ac 2 -ar 44100 -r 25 -s 640x480 -vb 320k -f flv 'rtmp://"+Meteor.settings.rtmpuser+":"+Meteor.settings.rtmppass+"@"+Meteor.settings.rtmp+"'"});
                            }).run();
                        }, time, [filepath]);
                    time = time+ms;
                    */
                }
                Meteor.call('encodeNext');
            }

        },
        'encodeNext':function(){
          console.log('encoding!');
           var Fiber = Npm.require('fibers');
            Fiber(function() {

                var file = encoder.findOne({});

                if(file != undefined){
                    //Meteor.call('encodeNext');

                    Meteor.call('remcmd', {channel:"ffmpeg", sock:{file:file}, cmd:"ffmpeg -re -i '"+file.path+"/"+file.filename+"' -vcodec libx264 -ab 128k -ac 2 -ar 44100 -r 25 -s 640x480 -vb 320k -f flv 'rtmp://"+Meteor.settings.rtmpuser+":"+Meteor.settings.rtmppass+"@"+Meteor.settings.rtmp+"'", callback:function(){

                        encoder.remove(encoder.findOne({})._id);
                        Meteor.call('encodeNext');

                    }});
                    //Meteor.call('remcmd', {cmd:"ffmpeg -re -i '"+file.path+"/"+file.filename+"' -vcodec libx264 -ab 128k -ac 2 -ar 44100 -r 25 -s 640x480 -vb 320k -f flv 'rtmp://"+Meteor.settings.rtmpuser+":"+Meteor.settings.rtmppass+"@"+Meteor.settings.rtmp+"'"});
                }else{
                    Meteor.call('emit', {channel:"ffmpeg", status:"ended", sock:{text:"stream ended"}})
                }
            }).run();
        }
    });

}