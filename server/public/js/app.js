window.$ = window.jQuery = require('./jquery');
window.moment = require('./moment');
require('./angular');
require('./bootstrap.js');
require('./qrcode.js');

// Libs do angular
require('./angular-ui-bootstrap');
require('./angular-route');
require('./angular-moment');
require('./angular-qrcode');

// Outras libs
require('./socket');

// Iniciando uma app com o Angular.js
window.app = angular.module('app', ['ngRoute', 'angularMoment', 'ui.bootstrap', 'monospaced.qrcode']);

// Carregando os controlladores
require('./controller/main-controller.js');
require('./controller/tx-controller.js');

// Carregando filtros

// Carregando factories

// Configurações da aplicação
app.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider){
    $locationProvider.hashPrefix('!');

    $routeProvider.when('/', {
        controller : 'MainCtrl',
        templateUrl : '/view/main.html'
    }).when('/tx/:code', {
        controller : 'TxCtrl',
        templateUrl : '/view/tx.html'
    });
}]);

// Iniciando a aplicação
angular.bootstrap(document, ['app']);
