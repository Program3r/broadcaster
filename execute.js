if(Meteor.isServer){
    Meteor.startup(function(){
        Meteor.methods({
            'runcommand': function(options){
                var exec = Npm.require('child_process').exec;
                exec(options.command,
                function (error, stdout, stderr) {
                    
                });
                return options;
            }
        });
    });
}