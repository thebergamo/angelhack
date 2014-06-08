window.socket = io();
var events = ['joined', 'leaved', 'update', 'update-timeline'];

events.map(function(name){
    socket.on(name, function(data){
        console.log('Despachando', name, data);
        angular.element(document).scope().$broadcast('socket::' + name, data);
    });
});
