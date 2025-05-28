angular.module("turismoApp")
.controller("FormularioPagoController", function($http) {
  const vm = this;
  vm.datos = {};
  vm.estructura = [];

  // Obtener estructura del formulario desde el backend
  vm.cargarFormulario = function () {
    $http.get("http://localhost:3000/api/estructura-formulario")
      .then(function (res) {
        vm.estructura = res.data;
      })
      .catch(function (err) {
        console.error("Error al cargar estructura", err);
      });
  };

  vm.cargarEstructura = function () {
  formularioService.obtenerEstructura().then(function (response) {
    vm.estructura = response.data;
  }).catch(function (error) {
    console.error("Error al cargar la estructura:", error);
  });
};


  vm.enviar = function () {
    alert("Formulario enviado con éxito");
  };

  vm.cargarFormulario();
});
