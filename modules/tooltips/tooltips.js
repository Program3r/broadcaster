if(Meteor.isClient){
    Meteor.startup(function(){
        $(document).ready(function(){
            var popovers = [{selector:".erase", options:{placement:"top", title:"<i class='icon-info-sign'></i> Root Folder", html:true, trigger:"hover", content:"Returns you to the root directory."}},
            {selector:".folderup", options:{placement:"top", title:"<i class='icon-info-sign'></i> Folder Up", html:true, trigger:"hover", content:"Takes you to the directory above the current one."}},
            {selector:"#repos", options:{placement:"right", title:"<i class='icon-info-sign'></i> Repo Selector", html:true, trigger:"hover", content:"This lets you choose which storage location to look for files."}},
            {selector:"#location", options:{placement:"bottom", title:"<i class='icon-info-sign'></i> Location", html:true, trigger:"hover", content:"The current address of the folder being displayed."}},
            {selector:".clearplaylist", options:{placement:"left",title:"<i class='icon-info-sign'></i> Clear Playlist", html:true, trigger:"hover", content:"Clears playlist of all files."}},
            {selector:".filterresults", options:{placement:"top", trigger:"focus", title:"<i class='icon-info-sign'></i> Filter Results", html:true, trigger:"hover", content:"Searches within current folder."}},
            {selector:".encode", options:{placement:"left", trigger:"focus", title:"<i class='icon-info-sign'></i> Encode", html:true, trigger:"hover", content:"Encodes all files in the playlist."}},
            {selector:"#fileexplorer .removeitem", options:{placement:"left", trigger:"hover", title:"<i class='icon-info-sign'></i> Delete File", html:true, trigger:"hover", content:"Deletes file from the system."}}
            ]
            $.each(popovers, function(){
                $(this.selector).popover(this.options);
                $(this.selector).hover(function () {
                    $(this).popover('show');
                    },
                    function () {
                    $(this).popover('hide'); 
                    }
                );
            })

        });
    });
}