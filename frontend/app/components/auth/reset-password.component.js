angular.module('ProyctoAngular').component('resetPassword', {
    templateUrl: 'app/components/auth/reset-password.component.html',
    controller: ['$rootScope', 'authService', '$timeout', function($rootScope, authService, $timeout) {
        var ctrl = this;
        
        ctrl.user = {
            email: '',
            newPassword: '',
            confirmPassword: '',
            authToken: ''
        };
        
        ctrl.error = null;
        ctrl.success = null;
        ctrl.token = null;
        ctrl.isSubmitting = false;

        ctrl.generateToken = function() {
            return Math.random().toString(36).substring(2, 15) + 
                   Math.random().toString(36).substring(2, 15);
        };

        // Primera etapa: solicitar token
        ctrl.requestToken = function() {
            ctrl.error = null;
            if (!ctrl.user.email) {
                ctrl.error = 'Por favor ingresa tu correo electrónico';
                return;
            }
            ctrl.token = ctrl.generateToken();
        };

        // Segunda etapa: validar token y cambiar contraseña
        ctrl.resetPassword = function() {
            ctrl.error = null;
            ctrl.success = null;
            ctrl.isSubmitting = true;

            // Validar que el token ingresado coincida
            if (ctrl.user.authToken !== ctrl.token) {
                ctrl.error = 'El token ingresado no es válido';
                ctrl.isSubmitting = false;
                return;
            }

            // Validar que las contraseñas coincidan
            if (ctrl.user.newPassword !== ctrl.user.confirmPassword) {
                ctrl.error = 'Las contraseñas no coinciden';
                ctrl.isSubmitting = false;
                return;
            }

            // Primero verificar si la contraseña es igual a la antigua
            authService.checkCurrentPassword(ctrl.user.email, ctrl.user.newPassword)
                .then(function(response) {
                    // Comparar con bcrypt en el backend
                    if (response.data.isSamePassword) {
                        ctrl.error = 'La contraseña ingresada es igual a la contraseña antigua';
                        ctrl.isSubmitting = false;
                        return Promise.reject('same_password');
                    }
                    
                    // Si la contraseña es diferente, proceder con el cambio
                    return authService.resetPassword({
                        email: ctrl.user.email,
                        newPassword: ctrl.user.newPassword
                    });
                })
                .then(function(response) {
                    ctrl.success = 'Contraseña actualizada correctamente';
                    
                    // Esperar 5 segundos antes de cerrar el modal
                    $timeout(function() {
                        var resetModal = bootstrap.Modal.getInstance(document.getElementById('resetPasswordModal'));
                        if (resetModal) {
                            resetModal.hide();
                        }
                        // Esperar a que el modal se cierre antes de abrir el de login
                        $timeout(function() {
                            var authModal = new bootstrap.Modal(document.getElementById('authModal'));
                            authModal.show();
                        }, 500);
                    }, 5000);
                })
                .catch(function(err) {
                    if (err !== 'same_password') {
                        ctrl.error = err.data?.message || 'Error al restablecer la contraseña';
                    }
                })
                .finally(function() {
                    // Solo cambiar isSubmitting si no es error de contraseña igual
                    if (!ctrl.error || !ctrl.error.includes('igual a la contraseña antigua')) {
                        ctrl.isSubmitting = false;
                    }
                });
        };

        ctrl.copyToken = function() {
            if (ctrl.token) {
                navigator.clipboard.writeText(ctrl.token).then(
                    function() {
                        alert('Token copiado al portapapeles');
                    },
                    function(err) {
                        console.error('Error al copiar: ', err);
                    }
                );
            }
        };

        ctrl.cancel = function() {
            // Limpiar el formulario y volver al inicio
            ctrl.user = {
                email: '',
                newPassword: '',
                confirmPassword: '',
                authToken: ''
            };
            ctrl.token = null;
            ctrl.error = null;
            ctrl.success = null;
            ctrl.isSubmitting = false;
        };
    }]
});