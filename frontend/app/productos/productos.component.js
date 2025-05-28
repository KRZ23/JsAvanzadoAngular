angular.module('turismoApp')
  .controller('ProductosController', ['$http', function($http) {
    const vm = this;
    vm.productos = [];

    // Cargar productos desde la API
    vm.cargarProductos = function () {
      $http.get('http://localhost:3000/api/productos')
        .then(function (response) {
          vm.productos = response.data;
        })
        .catch(function (error) {
          console.error('Error al cargar productos', error);
        });
    };

    // Agregar producto al carrito
    vm.agregarAlCarrito = function (producto) {
      $http.post('http://localhost:3000/api/carrito', producto)
        .then(function () {
          alert('Producto agregado al carrito');
        })
        .catch(function (error) {
          console.error('Error al agregar producto al carrito:', error);
        });
    };

    vm.cargarProductos();
  }]);
