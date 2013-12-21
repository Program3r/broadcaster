if(Meteor.isClient){
    Template.navigation.status = function(){
        return Meteor.status().status;
    }
}