// Definir el módulo principal con ngRoute como dependencia
angular.module("ProyctoAngular", ["ngRoute"])
    .config([
        "$routeProvider",
        "$locationProvider",
        "$httpProvider",
        function ($routeProvider, $locationProvider, $httpProvider) {
            // Configuración de rutas
            $routeProvider
                .when("/", {
                    templateUrl: "app/components/home/home.component.html",
                    controller: "HomeController",
                    controllerAs: "homeCtrl"
                })
                .when("/login", {
                    template: "<login></login>"
                })
                .when("/register", {
                    template: "<register></register>"
                })
                .otherwise({
                    redirectTo: "/"
                });

            // Usar modo hash para navegación (crucial para entorno portable)
            $locationProvider.hashPrefix("");
            $locationProvider.html5Mode(false);

            // Configurar cabeceras para CORS y agregar interceptor
            $httpProvider.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
            $httpProvider.defaults.useXDomain = true;
            delete $httpProvider.defaults.headers.common['X-Requested-With'];
            
            // Agregar interceptor de autenticación
            $httpProvider.interceptors.push('authInterceptor');
        }
    ])

    .run([
        "$rootScope",
        "authService",
        "$location",
        function($rootScope, authService, $location) {
            // Estado global de autenticación
            $rootScope.isAuthenticated = authService.isAuthenticated;
            $rootScope.currentUser = null;

            // Observar cambios en el usuario currente
            $rootScope.$watch(
                function() { return authService.currentUser; },
                function(newUser) { $rootScope.currentUser = newUser; }
            );

            // Función para mostrar el modal de autenticación
            $rootScope.showAuthModal = function() {
                var authModal = new bootstrap.Modal(document.getElementById('authModal'));
                authModal.show();
            };

            // Función para cerrar sesión
            $rootScope.logout = function() {
                authService.logout();
                $location.path('/');
            };

            // Cerrar modal después de login/registro exitoso
            $rootScope.$on('auth:success', function() {
                var authModal = bootstrap.Modal.getInstance(document.getElementById('authModal'));
                if (authModal) {
                    authModal.hide();
                }
            });
        }
    ]);