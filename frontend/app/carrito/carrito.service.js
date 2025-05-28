angular.module('turismoApp')
  .service('CarritoService', function() {
    let carrito = [];

    return {
      getCarrito: () => carrito,
      setCarrito: (items) => {
        carrito.length = 0;
        Array.prototype.push.apply(carrito, items);
      },
      vaciarCarrito: () => carrito.splice(0, carrito.length)
    };
  });
