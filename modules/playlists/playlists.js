playlistpersist = new Meteor.Collection("playlistpersist");

if(Meteor.isClient){
    Meteor.startup(function(){
        Meteor.call('reCalcTime');
    });
    Template.playlists.rendered = function(){
       // if (!this._rendered) {
            $("#playlists").find(".playlistcontainer").sortable({
              revert: true,
              receive: function(event, ui){
                /*$("#playlists").find(".exp-item").each(function(){
                   $(this).css("position", ""); 
                   $(this).css("top", "");
                   $(this).css("left", ""); 
                   $(this).css("-webkit-transform", "");
                   $(this).tagName = 'li';
                   $(this).find(".removeitem").click(function(){
                      $(this).parent().remove(); 
                   });});*/
                    $("#playlists").find(".isotope-item").each(function(){
                        var data = {icon:"icon-film", order:"", filename:$(this).attr("data-filename"), duration:$(this).attr("data-duration"), path:$(this).attr("data-path"), results:$(this).attr("data-results")};
                        playlistpersist.insert(data);
                        $(this).remove();
                    });
                Meteor.call('reCalcTime');
              },
              stop:function(event, ui){
                  $("#playlists").find(".exp-item").each(function(index){
                    playlistpersist.update($(this).attr("id"), {$set: {order: index}});
                    console.log($(this).attr("id"))
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
    Template.playlists.events({
        'click .encodefile':function(){
            var file = files.findOne({_id:this.fileid});
            
            //Meteor.call('runcommand', {command:"ffmpeg -re -i '"+file.path+"/"+file.filename+"' -vcodec libx264 -ab 128k -ac 2 -ar 44100 -r 25 -s 640x480 -vb 660k -f flv 'rtmp://"+Meteor.settings.public.rtmpuser+":"+Meteor.settings.public.rtmppass+"@"+Meteor.settings.public.rtmp+"'"}, function(err, res){
            //});
            console.log("ffmpeg -re -i '"+file.path+"/"+file.filename+"' -vcodec libx264 -ab 128k -ac 2 -ar 44100 -r 25 -s 640x480 -vb 660k -f flv 'rtmp://"+Meteor.settings.public.rtmpuser+":"+Meteor.settings.public.rtmppass+"@"+Meteor.settings.public.rtmp+"'");
        },
        'click .encode':function(){
            var options = [];
            
            $("#playlists .playlistcontainer .exp-item").each(function(){
               var thiss = $(this);
               options.push({duration:thiss.attr('data-duration'), filename:thiss.attr('data-filename'), path:thiss.attr('data-path')});
            });
            Meteor.call('encode', options);
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

                //var playlistitems = playlists.find({}).fetch();
                var time = 0;
                var execSync = Npm.require('exec-sync');
                
                for(i=0;i<options.length;i++){
                    var theseopt = options[i];
                    var file = theseopt.filename;
                    var fullduration = theseopt.duration;
                    var hrs = parseInt(fullduration.split(":")[0]);
                    var min = parseInt(fullduration.split(":")[1]);
                    var sec = parseInt(fullduration.split(":")[2].toString().split(".")[0])+1;
                    var ms = ((sec+(min*60)+(hrs*60*60))*1000)+6000;
                    console.log("Setting: "+time);
                   
                   
                   
                    var filepath = theseopt.path+"/"+file;
                        setTimeout(function(fpath){
                                console.log("Playing: "+fpath);
                                var exec = Npm.require('child_process').exec;
                                console.log("ffmpeg -re -i '"+fpath+"' -vcodec libx264 -ab 128k -ac 2 -ar 44100 -r 25 -s 640x480 -vb 320k -f flv 'rtmp://"+Meteor.settings.rtmpuser+":"+Meteor.settings.rtmppass+"@"+Meteor.settings.rtmp+"'");
                                exec("ffmpeg -re -i '"+fpath+"' -vcodec libx264 -ab 128k -ac 2 -ar 44100 -r 25 -s 640x480 -vb 320k -f flv 'rtmp://"+Meteor.settings.rtmpuser+":"+Meteor.settings.rtmppass+"@"+Meteor.settings.rtmp+"'",
                                function (error, stdout, stderr) {
                                    console.log(error);
                                    console.log(stderr);
                                    console.log(error);
                                });
                        }, time, [filepath]);
                    time = time+ms;
                    
                }
                
            }
        }
    });
    
}