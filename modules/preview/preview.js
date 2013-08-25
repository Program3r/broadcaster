if(Meteor.isServer){
    var express = Meteor.require('express');
    //var server = express.createServer();
    // express.createServer()  is deprecated. 
    var server = express(); // better instead
    server.configure(function(){
      var repos = Meteor.settings.public.videoRepos;
      for(i=0;i<repos.length;i++){
        server.use('/media'+repos[i], express.static(repos[i]));
      }
    });
    server.listen(8200);
}
if(Meteor.isClient){
    Template.fileexplorer.events({
        'click .preview':function(event){
            var item = $(event.toElement).closest(".exp-item");
            var path = item.attr("data-path");
            var filename = item.attr("data-filename");
            var url = path;
            
            $("#previewPlayer").html(Template.videopreview({url:"http://"+window.location.hostname+":8200/media"+path+"/"+filename}))
            $('#previewModal').modal('show');
        }
    });
}