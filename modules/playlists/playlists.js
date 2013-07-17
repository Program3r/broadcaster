if(Meteor.isClient){
    Meteor.startup(function(){
        var playlistshtml = Meteor.render(function(){
            return Template.playlists(playlists.find({}));
        });
        $("body").append(playlistshtml);
    });
    Template.playlists.rendered = function(){
        if (!this._rendered) {
            $("#playlists").find("table").droppable({
                accept:".draggablefile",
                drop:function(event, ui){
                    playlists.insert({"fileid":$(ui.draggable).attr('data-fileid')});
                }
            });
            this._rendered = true;
        }
    }
    Template.playlists.playlistitems = function(){
        return playlists.find({});
    }
    Template.playlists.filename = function(){
        var thefile = files.findOne({_id:this.fileid});
        return thefile.filename;
    }
    Template.playlists.duration = function(){
        var thefile = files.findOne({_id:this.fileid});
        return thefile.duration;
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
            Meteor.call('encode');
        },
        'click .clearplaylist':function(){
            Meteor.call('clearplaylists');
        }
    });
}

if(Meteor.isServer){
    Meteor.methods({
        'playplaylist':function(){
            var filelist = playlists.find({});
            console.log()
        },
        'encode':function(){
            if(Meteor.isServer){
                console.log("Started");
                console.log(Meteor.settings)
                var playlistitems = playlists.find({}).fetch();
                var time = 0;
                var execSync = Npm.require('exec-sync');
                console.log('playing');
                for(i=0;i<playlistitems.length;i++){
                    
                    var file = files.findOne({_id:playlistitems[i].fileid});
                    var fullduration = file.duration;
                    var hrs = parseInt(file.duration.split(":")[0]);
                    var min = parseInt(file.duration.split(":")[1]);
                    var sec = parseInt(file.duration.split(":")[2].toString().split(".")[0])+1;
                    var ms = ((sec+(min*60)+(hrs*60*60))*1000)+6000;
                    console.log("Setting: "+time);
                    var filepath = file.path+"/"+file.filename;
                        setTimeout(function(){
                                console.log("Playing: "+filepath);
                                var exec = Npm.require('child_process').exec;
                                console.log("ffmpeg -re -i '"+filepath+"' -vcodec libx264 -ab 128k -ac 2 -ar 44100 -r 25 -s 640x480 -vb 320k -f flv 'rtmp://"+Meteor.settings.rtmpuser+":"+Meteor.settings.rtmppass+"@"+Meteor.settings.rtmp+"'");
                                exec("ffmpeg -re -i '"+filepath+"' -vcodec libx264 -ab 128k -ac 2 -ar 44100 -r 25 -s 640x480 -vb 320k -f flv rtmp://"+Meteor.settings.rtmpuser+":"+Meteor.settings.rtmppass+"@"+Meteor.settings.rtmp,
                                function (error, stdout, stderr) {
                                    console.log(error);
                                    console.log(stderr);
                                    console.log(error);
                                });
                        }, time);
                    time = time+ms;
                    
                }
            }
        },
        'clearplaylists':function(){
            playlists.remove({});
        }
    });
    
}