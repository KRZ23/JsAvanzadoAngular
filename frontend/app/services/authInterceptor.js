angular.module('ProyctoAngular').factory('authInterceptor', ['$window', function($window) {
    return {
        request: function(config) {
            const token = $window.localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = 'Bearer ' + token;
            }
            return config;
        },
        responseError: function(rejection) {
            if (rejection.status === 401) {
                // Token expirado o inválido
                $window.localStorage.removeItem('token');
                $window.localStorage.removeItem('user');
                // Redirigir al login o mostrar modal
                var authModal = new bootstrap.Modal(document.getElementById('authModal'));
                authModal.show();
            }
            return Promise.reject(rejection);
        }
    };
}]);