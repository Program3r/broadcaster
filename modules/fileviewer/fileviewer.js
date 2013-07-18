if(Meteor.isClient){
    Meteor.startup(function(){
        var fileviewer = Meteor.render(function(){
            Meteor.call('getfiles');
            return Template.filetable(files.find({}));
        });
        //$("body").append(fileviewer);
    });
  
  
  
  
  
    //Search For Files In The Registry
    Template.files.file = function(){
        return files.find({}); 
    }
    Template.filetable.file = function(){
        return files.find({});
        
    }
    
    
    
    //Make Elements Draggable
    Template.file.rendered = function(){
        if (!this._rendered) {
            $("#"+this.data._id).draggable({ revert: true });
            this._rendered = true;
            //$("#filemanager").isotope('appended', $("#"+this.data._id));
        }
    }
    Template.filetablefile.rendered = function(){
        $(this.firstNode).find(".draggablefile").draggable({revert:true});
    }
    
    
    Template.filetable.constant = function(){
        console.log(this);
    }
    
    Template.file.events({
        'click .file-info':function(){
            console.log(this);
        }
    });
    Template.files.rendered = function(){
        if (!this._rendered) {
            //console.log(container);
            this._rendered = true;
        }
    }
    Template.flvplayer.filepath = function(){
        var path = '/videos/';
        return path+this.filename;
    }
    Template.filetable.events({
        'click .purgefiles':function(){
            Meteor.call('purgefiles');
            window.location = window.location;
        }
    });
}
if(Meteor.isServer){
    Meteor.methods({
        'getfiles': function(options){
            var fs = Npm.require('fs');
            var Fiber = Npm.require('fibers');
            //var path = '/root/storage/videos';
            var path = '/root/videos';
            fs.readdir(path, function(err, filelist){
                flist = filelist;
                Fiber(function(flist) {
                    var filelist = this.flist;
                    for(i=0;i<filelist.length;i++){
                        //var ret = files.insert({filename:filelist[i], extension:filelist[i].split(".")[1]});
                        var lookforrecord = files.findOne({filename:filelist[i]});
                        if(lookforrecord == undefined){
                            var execSync = Npm.require('exec-sync');
                            var result = execSync("ffmpeg -i "+path+"/"+filelist[i]+" 2>&1 | grep Duration");
                            var duration = result.split(",")[0].toString().replace("Duration: ", "");
                            files.insert({filename:filelist[i], extension:filelist[i].split(".")[1], path:path, duration:duration});
                            console.log("Found New File: "+filelist[i]);
                        }
                    }
                    //files.insert({filename:"test"});
                }).run();
            });
        },
        'purgefiles':function(){
            files.remove({});
        }
    })
}