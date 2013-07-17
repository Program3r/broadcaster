if(Meteor.isClient){
    Meteor.startup(function(){
        $(document).ready(function(){
            var programsettings = settings.findOne({});
            console.log(programsettings);
            if(programsettings == undefined){
                $("#settings").modal('show'); 
                $("#settings .modal-body").prepend(Template.settingsnotice({}));
            }
        });
    });
    Template.settings.settings = function(){
        return settings.find({});
    }
}
if(Meteor.isServer){
    console.log(Meteor.settings);
}