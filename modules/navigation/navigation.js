if(Meteor.isClient){
    Template.navigation.status = function(){
        console.log(Meteor.status())
        return Meteor.status().status;
    }
}