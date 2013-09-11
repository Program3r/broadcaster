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
                    sock.emit( 'msg', "");
                    var proc = exec(options.cmd);
                    carrier = Meteor.require( 'carrier' );
                    carrier2 = Meteor.require( 'carrier' );
                    var my_carrier = carrier.carry( proc.stderr );
                    my_carrier.on( 'line', function( line ) {
                        //sock.emit( 'msg', {pid:proc.pid, cmd:options.cmd, line:line} );
                    });
                    
                    var my_carrier2 = carrier2.carry( proc.stdout );
                    my_carrier2.on( 'line', function( line ) {
                        //sock.emit( 'msg', {pid:proc.pid, cmd:options.cmd, line:line} );
                    });
                    
                    proc.on('exit', function (code) {
                      sock.emit( 'msg','child process '+proc.pid+' exited with code ' + code);
                    });
                    proc.on('close', function (code) {
                      sock.emit( 'msg','child process closed with code ' + code);
                     var Fiber = Npm.require('fibers');
                        Fiber(function() {
                      encoder.remove(encoder.findOne()._id);
                      Meteor.call('encodeNext');
                        }).run()
                        
                    });
                    proc.on('disconnect', function (code) {
                      sock.emit( 'msg','child process disconnected with code ' + code);
                    });
            }
            
        });
        
    });
}