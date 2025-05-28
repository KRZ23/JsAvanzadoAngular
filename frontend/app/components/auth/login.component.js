angular.module('ProyctoAngular').component('login', {
    templateUrl: 'app/components/auth/login.component.html',
    controller: ['$rootScope', '$location', 'authService', function($rootScope, $location, authService) {
        var ctrl = this;
        
        ctrl.user = {
            email: '',
            password: ''
        };
        
        ctrl.rememberMe = false;
        ctrl.error = null;

        ctrl.login = function() {
            ctrl.error = null;
            authService.login(ctrl.user)
                .then(function(response) {
                    $rootScope.$emit('auth:success');
                    $location.path('/');
                })
                .catch(function(error) {
                    ctrl.error = error.data?.message || 'Error al iniciar sesión';
                });
        };

        ctrl.showResetPassword = function($event) {
            $event.preventDefault();
            // Cerrar el modal de autenticación
            var authModal = bootstrap.Modal.getInstance(document.getElementById('authModal'));
            if (authModal) {
                authModal.hide();
            }
            // Abrir el modal de reset password
            var resetModal = new bootstrap.Modal(document.getElementById('resetPasswordModal'));
            resetModal.show();
        };

        ctrl.loginWithFacebook = function() {
            // Implementar login con Facebook
        };

        ctrl.loginWithGoogle = function() {
            // Implementar login con Google
        };
    }]
});