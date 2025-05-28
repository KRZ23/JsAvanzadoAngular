angular.module('turismoApp') 
  .service('apiService', ['$http', function($http) {
    const BASE_URL = 'http://localhost:3000/api';

    this.getProductos = () => $http.get(`${BASE_URL}/productos`);
    this.agregarProducto = (p) => $http.post(`${BASE_URL}/productos`, p);
    this.eliminarProducto = (index) => $http.delete(`${BASE_URL}/productos/${index}`);

    this.getCarrito = () => $http.get(`${BASE_URL}/carrito`);
    this.agregarAlCarrito = (producto) => $http.post(`${BASE_URL}/carrito`, producto);
    this.eliminarDelCarrito = (index) => $http.delete(`${BASE_URL}/carrito/${index}`);
  }]);
