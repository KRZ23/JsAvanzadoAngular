angular.module('ProyctoAngular').service('authService', ['$http', '$window', function($http, $window) {
    var service = this;
    var API_URL = 'http://localhost:3000/api/auth';

    service.currentUser = null;

    service.login = function(credentials) {
        return $http.post(API_URL + '/login', credentials)
            .then(function(response) {
                service.setSession(response.data);
                return response.data;
            });
    };

    service.register = function(userData) {
        return $http.post(API_URL + '/register', userData)
            .then(function(response) {
                service.setSession(response.data);
                return response.data;
            });
    };

    service.resetPassword = function(resetData) {
        return $http.post(API_URL + '/reset-password', resetData);
    };

    service.checkCurrentPassword = function(email, newPassword) {
        return $http.post(API_URL + '/check-password', { email, newPassword });
    };

    service.setSession = function(data) {
        service.currentUser = data.user;
        $window.localStorage.setItem('token', data.token);
        $window.localStorage.setItem('user', JSON.stringify(data.user));
    };

    service.logout = function() {
        service.currentUser = null;
        $window.localStorage.removeItem('token');
        $window.localStorage.removeItem('user');
    };

    service.isAuthenticated = function() {
        return !!service.currentUser;
    };

    // Cargar usuario si existe token almacenado
    var storedUser = $window.localStorage.getItem('user');
    if (storedUser) {
        service.currentUser = JSON.parse(storedUser);
    }

    return service;
}]);