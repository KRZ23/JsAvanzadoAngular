angular.module('ProyctoAngular').component('register', {
    templateUrl: 'app/components/auth/register.component.html',
    controller: ['$rootScope', '$location', 'authService', function($rootScope, $location, authService) {
        var ctrl = this;
        
        ctrl.user = {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: ''
        };
        
        ctrl.termsAccepted = false;
        ctrl.error = null;

        ctrl.register = function() {
            ctrl.error = null;
            
            if (ctrl.user.password !== ctrl.user.confirmPassword) {
                ctrl.error = 'Las contraseñas no coinciden';
                return;
            }

            if (!ctrl.termsAccepted) {
                ctrl.error = 'Debes aceptar los términos y condiciones';
                return;
            }

            // Eliminar confirmPassword antes de enviar
            var userData = {...ctrl.user};
            delete userData.confirmPassword;

            authService.register(userData)
                .then(function(response) {
                    $rootScope.$emit('auth:success');
                    $location.path('/');
                })
                .catch(function(error) {
                    ctrl.error = error.data?.message || 'Error al registrarse';
                });
        };
    }]
});