angular.module("turismoApp").controller("CarritoController", [
  "$http",
  function ($http) {
    const vm = this;
    vm.carrito = [];

    // Cargar los productos del carrito
    vm.cargarCarrito = function () {
      $http
        .get("http://localhost:3000/api/carrito")
        .then(function (response) {
          vm.carrito = response.data;
        })
        .catch(function (error) {
          console.error("Error al cargar el carrito", error);
        });
    };

    // Eliminar un producto del carrito por su ID
    vm.eliminarDelCarrito = function (id) {
      $http
        .delete(`http://localhost:3000/api/carrito/${id}`)
        .then(function () {
          vm.cargarCarrito();
        })
        .catch(function (error) {
          console.error("Error al eliminar del carrito:", error);
          alert("No se pudo eliminar el producto.");
        });
    };

    // Calcular total a pagar
    vm.calcularTotal = function () {
      return vm.carrito.reduce((total, producto) => total + producto.precio, 0);
    };

    // Mostrar modal de pago
    vm.pagar = function () {
      const modal = new bootstrap.Modal(document.getElementById("modalPago"));
      modal.show();
    };

    vm.vaciarCarrito = function () {
      if (confirm("¿Estás seguro de vaciar el carrito?")) {
        vm.carrito = [];
        localStorage.removeItem("carrito"); // si usas localStorage
        alert("Carrito vaciado");
      }
    };

    vm.pagar = function () {
      alert(
        "Aquí debería abrirse el formulario de pago o redirigir a otra vista"
      );
    };

    vm.cargarCarrito();
  },
]);
