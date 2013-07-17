if(Meteor.isClient){
    Template.testing.events({
        'click .streamvideo':function(){
            console.log("Executing Command");
            Meteor.call('runcommand', {command:"ffmpeg -re -i ~/sample.flv -f flv rtmp://live.justin.tv/app/live_32682096_GzFhPArLyeL6JJ6jai78xrgCVd4maz"}, function(err, res){
                
            });
        },
        'click .streamfluentvideo':function(){
            console.log("Executing Command");
            Meteor.call('stream');
        }
    });
}