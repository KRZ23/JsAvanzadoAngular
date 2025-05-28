// Controlador para la vista de inicio
angular.module('ProyctoAngular')
.controller('HomeController', ['$scope', '$http', function($scope, $http) {
    var vm = this;

    // Datos de ejemplo para productos
    vm.productos = [
        { nombre: 'ACEITE HONDA 4T 10W30 1000ML', precio: 44.00, imagen: 'assets/public/productos/aceite.webp', descuento: 10, calificacion: 4.5, reviews: 45 },
        { nombre: 'HJC C80 ROX NEGRO/ROJO/GRIS L', precio: 1040.00, imagen: 'assets/public/productos/casco.webp', descuento: 15, calificacion: 5, reviews: 32 },
        { nombre: 'GUANTE SD-N47 INVIERN URBAN HOM NGR L', precio: 256.00, imagen: 'assets/public/productos/guantes.webp', calificacion: 4, reviews: 28 },
        { nombre: 'LLANTA PIRELLI DIABLO ROSSO III 180/55-17', precio: 680.00, imagen: 'assets/public/productos/llanta.webp', calificacion: 4.5, reviews: 19 }
    ];

    // Datos de ejemplo para consejos
    vm.consejos = [
        { titulo: 'Cambiar el Aceite', descripcion: 'Asegúrate de utilizar el tipo de aceite correcto para tu moto.', imagen: 'assets/public/productos/aceite.webp' },
        { titulo: 'Revisar las Pastillas de Freno', descripcion: 'Las pastillas desgastadas pueden comprometer tu seguridad en carretera.', imagen: 'assets/public/productos/pastillasDesgastadas.jpg' }
    ];

    // Datos de ejemplo para opiniones
    vm.opiniones = [
        { nombre: 'María C.', calificacion: 5, comentario: 'Excelente calidad y variedad de repuestos.', imagen: 'assets/public/perfil02.jpg' },
        { nombre: 'Pablo M.', calificacion: 5, comentario: 'Rápido envío y atención al cliente excepcional.', imagen: 'assets/public/perfil01.jpg' },
        { nombre: 'Laura S.', calificacion: 5, comentario: 'Precios competitivos y productos originales.', imagen: 'assets/public/perfil02.jpg' }
    ];

    // Estado para mostrar/ocultar consejos
    vm.mostrarConsejos = false;
    vm.botonTexto = "Leer más";

    vm.toggleConsejos = function() {
        vm.mostrarConsejos = !vm.mostrarConsejos;
        vm.botonTexto = vm.mostrarConsejos ? "Leer menos" : "Leer más";
    };

    // Función para agregar producto al carrito (ejemplo)
    vm.agregarAlCarrito = function(producto) {
        alert('Producto agregado al carrito: ' + producto.nombre);
    };

    // Ofertas para el carrusel
    vm.ofertas = [];

    // Función para cargar ofertas desde el backend
    vm.cargarOfertas = function() {
        $http.get('/api/ofertas')
            .then(function(response) {
                vm.ofertas = response.data;
            })
            .catch(function(error) {
                console.error('Error al cargar ofertas:', error);
            });
    };

    // Cargar ofertas al iniciar el controlador
    vm.cargarOfertas();
}]);
