
import axios from 'axios';
import Swal from 'sweetalert2';
import { reactive, ref } from 'vue';
import { required } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import { useRouter } from 'vue-router';

export default {
    name: 'UserRegistrationForm',
    setup() {
        const project = reactive({
            firstName: '',
            lastName: '',
            companyName: '',
            phoneNumber: '',
            emailId: '',
            address: '',
            password: '',
            confirmPassword: ''
        });

        const showErrors = ref(false);
        const isSaving = ref(false);
        const passwordFieldType = ref('password');
        const confirmPasswordFieldType = ref('password');
        const router = useRouter(); // Use the router instance

        const rules = {
            project: {
                firstName: { required },
                lastName: { required },
                companyName: { required },
                phoneNumber: { required },
                emailId: { required },
                address: { required },
                password: { required },
                confirmPassword: { required }
            }
        };

        const v$ = useVuelidate(rules, { project });

        const togglePasswordVisibility = (field) => {
            if (field === 'password') {
                passwordFieldType.value = passwordFieldType.value === 'password' ? 'text' : 'password';
            } else if (field === 'confirmPassword') {
                confirmPasswordFieldType.value = confirmPasswordFieldType.value === 'password' ? 'text' : 'password';
            }
        };

        const userRegister = async () => {
            showErrors.value = true;
            v$.value.$touch();
            if (v$.value.$invalid) {
                console.log('Validation failed:', v$.value);
                return;
            }
            project.userName = project.emailId;
            isSaving.value = true;
            try {
                const response = await axios.post('/api/saveUserDetails', project); // Use project directly
                Swal.fire({
                    icon: 'success',
                    title: 'Register successfully!',
                    showConfirmButton: true,
                    timer: 1500
                });
                // Reset form
                Object.keys(project).forEach(key => {
                    project[key] = '';
                });
                isSaving.value = false;
                router.push('/'); // Use router for redirection
                console.log('Registration response:', response);
            } catch (error) {
                isSaving.value = false;
                Swal.fire({
                    icon: 'error',
                    title: 'An Error Occurred!',
                    showConfirmButton: true,
                    timer: 1500
                }).then(() => {
                    router.push('/'); // Use router for redirection
                });
                console.log('Registration error:', error);
            }
        };

        return {
            project,
            v$,
            showErrors,
            userRegister,
            isSaving,
            togglePasswordVisibility,
            passwordFieldType,
            confirmPasswordFieldType,
        };
    }
};