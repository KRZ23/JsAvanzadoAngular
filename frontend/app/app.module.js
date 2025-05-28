angular.module('turismoApp', ['ngRoute'])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/productos', {
        templateUrl: 'app/productos/productos.component.html',
        controller: 'ProductosController',
        controllerAs: 'vm'
      })
      .when('/carrito', {
        templateUrl: 'app/carrito/carrito.component.html',
        controller: 'CarritoController',
        controllerAs: 'vm'
      })
      .otherwise({ redirectTo: '/productos' });
  }]);
