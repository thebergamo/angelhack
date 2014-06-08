app.controller('TxCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams){
    var joined = false;

    $scope.tx = {};
    $scope.messages = [];
    $scope.message = {};
    $scope.type = '';
    $scope.loginType = '';

    $scope.update = function(){
        $http.get('/api/transactions?conditions={"code" : "' + $routeParams.code + '"}').then(function(res){
            $scope.tx = res.data[0];

            if(!joined)
                socket.emit('join', $scope.tx._id);

            joined = true;

            $http.get('/api/messages?sort=-date&conditions={"transaction_id" : "' + $scope.tx._id + '"}').then(function(res){
                $scope.messages = res.data;
            });
        });
    };

    $scope.finalizar = function(msg){
        var message = {
            transaction_id : $scope.tx._id,
            sender : 'system',
            finished : true,
            message : msg
        };

        $http.post('/api/messages', message).then(function(res){
            console.log(res);
        });
    };

    $scope.doLogin = function(){
        $scope.type = $scope.loginType;
    };

    $scope.sendMessage = function(){
        $scope.message.transaction_id = $scope.tx._id;
        $scope.message.sender = $scope.type;

        $http.post('/api/messages', $scope.message).then(function(res){
            $scope.message = {};
        });
    };

    $scope.update();
    $scope.$on('socket::update', $scope.update);
}]);
