if(Meteor.isClient){
    Template.fileexplorer.rendered = function(){
        if (!this._rendered) {
                this._rendered = true;
                
        }

    //$("#"+this.id).isotope();
    }

    Meteor.startup(function(){
        $.each(Meteor.settings.public.videoRepos, function(index, val){
            var opt = $("<option value='"+index+"'>"+val+"</option>");
            $("#repos").append(opt);
        });
        Meteor.call('updateExplorer');
    

    });
    Template.fileexplorer.events({
       'click .navigate':function(){
            Meteor.call('updateExplorer');
       },
       'click .erase':function(){
           $("#location").val("");
           Meteor.call('updateExplorer');
       },
       'click .folderup':function(){
           var loc = $("#location").val();
           var folderup = loc.substring(0,loc.lastIndexOf('/'));
           $("#location").val(folderup);
           Meteor.call('updateExplorer');
       },
       'change #repos':function(){
          Meteor.call('updateExplorer'); 
       }
    });


}

if(Meteor.isServer){
    
    Meteor.startup(function(){
        var express = Meteor.require('express');
        var app = express();
        app.get('/:repo/*', function(req, res){
            var path = Meteor.settings.public.videoRepos[req.params.repo];
            
            function getQueryVariable(variable) {
                var query = req.url.split('?')[1];
                var vars = query.split('&');
                for (var i = 0; i < vars.length; i++) {
                    var pair = vars[i].split('=');
                    if (decodeURIComponent(pair[0]) == variable) {
                        return decodeURIComponent(pair[1]);
                    }
                }
            }
            
            if(typeof getQueryVariable('path') != "undefined"){
                path+=decodeURIComponent(getQueryVariable('path'));
            }
            
            var fs = Npm.require('fs');
            fs.readdir(path, function(err, filelist){
                var filedata = [];
                for(i=0;i<filelist.length;i++){
                    var execSync = Npm.require('exec-sync');
                    var result = execSync("ffmpeg -i '"+path+"/"+filelist[i]+"' 2>&1 | grep Duration");
                    var duration = result.split(",")[0].toString().replace("Duration: ", "");
                    filedata.push({filename:filelist[i], duration:duration.replace(/ /g,''), path:path, results:result});
                }
                res.send("Meteor.call('loadExplorerData', "+JSON.stringify(filedata)+")");
            });
        });
        app.listen(9000);
    });
}

if(Meteor.isClient){
    Meteor.methods({
        'updateExplorer':function(options){
            var subdir = "/";
            if($("#location").val() > ""){
                subdir = "/?path="+encodeURIComponent($("#location").val());
            }
            $.ajax({
              url: "http://"+window.location.hostname+":9000/"+$("#repos").val()+subdir,
              context: document.body,
              dataType:'jsonp',
              jsonpCallback: ""
            }).done(function() {
            
            });
        },
        'loadExplorerData':function(data){
            $("#fileexplorer").html("");
            $.each(data, function(key, val){
               var icon;
               if(val.filename.indexOf('.flv') == -1){
                   icon = "icon-folder-close";
               }else{
                   icon = "icon-film";
               }
               var expitem = $(Template.exploreritem({filename:val.filename, icon:icon, duration:val.duration}));
               
                $("#fileexplorer").append(expitem);
                if(val.filename.indexOf('.flv') != -1){
                    //This must be a video file
                    expitem.draggable({ revert: true });
                }else{
                    //This must be a folder
                    expitem.addClass('ui-clickable');
                    expitem.click(function(){
                        var folderpath = $("#location").val()+"/"+$(this).attr('data-filename');
                        $("#location").val(folderpath);
                        Meteor.call('updateExplorer');
                    });
                    expitem.addClass('folder');
                    expitem.find(".icon-time").css({display:"none"})
                }
                
                $.each(val, function(key, val){
                   expitem.attr("data-"+key, val); 
                });
            });
        }
    });
}


