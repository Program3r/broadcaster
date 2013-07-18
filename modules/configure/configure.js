if(Meteor.isClient){
    Meteor.startup(function(){
        $(document).ready(function(){
            /*if(Meteor.settings.public == undefined){
                $("#settings").modal('show'); 
                $("#settings .modal-body").prepend(Template.settingsnotice({}));
            }*/
        });
    });
    Template.settings.settings = function(){
        return settings.find({});
    }
    Template.settings.events({
        'click .update': function(){
            Meteor.call('updateBroadcaster');
        }
    })
}

if(Meteor.isServer){
    Meteor.methods({
        'updateBroadcaster':function(callback){
            var exec = Npm.require('child_process').exec;
                exec("git fetch --all",
                function (error, stdout, stderr) {
                    console.log(stdout)
                });
                exec("git reset --hard origin/master",
                function (error, stdout, stderr) {
                    console.log(stdout)
                });
        }
    })
}