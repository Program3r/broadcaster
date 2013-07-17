if(Meteor.isClient){
    Meteor.startup(function(){
        $(document).ready(function(){
            var popovers = [
                {selector:".purgefiles", options:{title:"<i class='icon-info-sign'></i> Purging Files", html:true, trigger:"hover", content:"Purging files removes them from the database, you would want to do this if you have deleted a file. Doing this un-links them from the playlists. You have to clear all playlists of files."}}
            ]
            $.each(popovers, function(){
                $(this.selector).popover(this.options);
                /*$(this.selector).hover(function () {
                    $(this).popover('show');
                    },
                    function () {
                    $(this).popover('hide'); 
                    }
                );*/
            })

        });
    });
}