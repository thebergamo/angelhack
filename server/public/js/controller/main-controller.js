app.controller('MainCtrl', ['$scope', '$http', '$location', function($scope, $http, $location){
    $scope.transaction = {};
    $scope.search = '';

    $scope.viewTransaction = function(){
        $location.path('/tx/' + $scope.search);
    };

    $scope.newTransaction = function(){
        $http.post('/api/transactions', $scope.transaction).then(function(res){
            $location.path('/tx/' + res.data.code);
        });
    };
}]);
