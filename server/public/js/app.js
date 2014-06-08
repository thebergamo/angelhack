// Iniciando uma app com o Angular.js
window.app = angular.module('app', ['ngRoute', 'angularMoment', 'ui.bootstrap']);

// Carregando os controlladores
require('./controller/main-controller.js');
require('./controller/comparador-controller.js');
require('./controller/games-controller.js');
require('./controller/compare-controller.js');

// Carregando filtros

// Carregando factories

// Configurações da aplicação
app.config(['$locationProvider', '$routeProvider', 'marked', function($locationProvider, $routeProvider, marked){
    $locationProvider.hashPrefix('!');

    marked.setOptions({
        gfm: true
    });

    $routeProvider.when('/', {
        controller : 'MainCtrl',
        templateUrl : '/view/site/main.html'
    }).when('/compare/:slug1/:slug2', {
        controller : 'CompareCtrl',
        templateUrl : '/view/site/compare.html'
    }).when('/news', {
        controller : 'NewsCtrl',
        templateUrl : '/view/site/news.html'
    }).when('/news/:slug', {
        controller : 'NewsCtrl',
        templateUrl : '/view/site/news-view.html'
    }).when('/games', {
        controller : 'GamesCtrl',
        templateUrl : '/view/site/games.html'
    }).when('/game/:slug', {
        controller : 'GameCtrl',
        templateUrl : '/view/site/games.html'
    }).when('/reviews', {
        controller : 'ReviewsCtrl',
        templateUrl : '/view/site/reviews.html'
    }).when('/review/:slug', {
        controller : 'ReviewCtrl',
        templateUrl : '/view/site/reviews.html'
    }).when('/hardwares', {
        controller : 'HardwaresCtrl',
        templateUrl : '/view/site/reviews.html'
    }).when('/hardware/:slug', {
        controller : 'HardwareCtrl',
        templateUrl : '/view/site/reviews.html'
    }).when('/about', {
        controller : 'AboutCtrl',
        templateUrl : '/view/site/about.html'
    }).when('/contact', {
        controller : 'ContactCtrl',
        templateUrl : '/view/site/contact.html'
    });
}]);

// Iniciando a aplicação
angular.bootstrap(document, ['app']);
