tcmd = new Meteor.Collection("tcmd");
if(Meteor.isServer){
    Meteor.startup(function(){
        var io = Meteor.require('socket.io').listen(3100);
        var sock;
        io.sockets.on('connection', function (socket) {
            sock = socket;
        });
        var exec = Npm.require('child_process').exec;
        Meteor.methods({
            'remcmd':function(options){
                    sock.emit( options.channel, "");
                    var proc = exec(options.cmd);
                    carrier = Meteor.require( 'carrier' );
                    carrier2 = Meteor.require( 'carrier' );
                    var my_carrier = carrier.carry( proc.stderr );
                    my_carrier.on( 'line', function( line ) {
                        sock.emit( options.channel, {status:"stderr", pid:proc.pid, sock:options.sock, line:line} );
                    });
                    
                    var my_carrier2 = carrier2.carry( proc.stdout );
                    my_carrier2.on( 'line', function( line ) {
                        sock.emit( options.channel, {status:"stdout", pid:proc.pid, cmd:options.cmd, line:line} );
                    });
                    
                    proc.on('exit', function (code) {
                      sock.emit( options.channel,{status:"exited", sock:options.sock});
                    });
                    proc.on('close', function (code) {
                      sock.emit( options.channel,{status:"closed", sock:options.sock});
                     var Fiber = Npm.require('fibers');
                        Fiber(function() {   
                      options.callback();
                        }).run()
                        
                    });
                    proc.on('disconnect', function (code) {
                      sock.emit( options.channel,{status:"disconnected", sock:options.sock});
                    });
                    
            },
            'emit':function(options){
                sock.emit( options.channel,{status:options.status, sock:options.sock});
            }
            
        });
        
    });
}