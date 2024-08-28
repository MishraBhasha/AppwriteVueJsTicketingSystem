<template>
  <layout-div>
    <div class="container mt-4">
      <div class="row justify-content-center">
        <div class="col-md-9 border rounded shadow p-4" :style="{ backgroundColor: 'rgba(255, 255, 255, 0.25)' }">
          <form @submit.prevent="userRegister">
            <h3 class="text-center m-4">User Registration Form</h3>
            <div class="row">
              <div class="col-md-6 mb-2">
                <div class="input-field">
                  <label for="firstName">First Name</label>
                  <input v-model="project.firstName" type="text" class="form-control" id="firstName" name="firstName" />
                  <div v-if="showErrors && !v$.project.firstName.$pending && !v$.project.firstName.$model"
                    class="text-danger">
                    First Name is required.
                  </div>
                </div>
              </div>

              <div class="col-md-6 mb-2">
                <div class="input-field">
                  <label for="lastName">Last Name</label>
                  <input v-model="project.lastName" type="text" class="form-control" id="lastName" name="lastName" />
                  <div v-if="showErrors && !v$.project.lastName.$pending && !v$.project.lastName.$model"
                    class="text-danger">
                    Last Name is required.
                  </div>
                </div>
              </div>

              <div class="col-md-6 mb-2">
                <div class="input-field">
                  <label for="companyName">Company Name</label>
                  <input v-model="project.companyName" type="text" class="form-control" id="companyName"
                    name="companyName" />
                  <div v-if="showErrors && !v$.project.companyName.$pending && !v$.project.companyName.$model"
                    class="text-danger">
                    Company Name is required.
                  </div>
                </div>
              </div>

              <div class="col-md-6 mb-2">
                <div class="input-field">
                  <label for="phoneNumber">Phone Number</label>
                  <input v-model="project.phoneNumber" type="text" class="form-control" id="phoneNumber"
                    name="phoneNumber" />
                  <div v-if="showErrors && !v$.project.phoneNumber.$pending && !v$.project.phoneNumber.$model"
                    class="text-danger">
                    Phone Number is required.
                  </div>
                </div>
              </div>

              <div class="col-md-6 mb-2">
                <div class="input-field">
                  <label for="emailId">EmailId</label>
                  <input v-model="project.emailId" type="text" class="form-control" id="emailId" name="emailId" />
                  <div v-if="showErrors && !v$.project.emailId.$pending && !v$.project.emailId.$model"
                    class="text-danger">
                    EmailId is required.
                  </div>
                </div>
              </div>
              <div class="col-md-6 mb-2">
                <div class="input-field">
                  <label for="address">Address</label>
                  <input v-model="project.address" type="text" class="form-control" id="address" name="address" />
                  <div v-if="showErrors && !v$.project.address.$pending && !v$.project.address.$model"
                    class="text-danger">
                    Address is required.
                  </div>
                </div>
              </div>

              <div class="col-md-6 mb-2">
                <div class="input-field">
                  <label for="password">Password</label>
                  <div class="input-group">
                    <input v-model="project.password" class="form-control" id="password" name="password"
                      :type="passwordFieldType" />
                    <span class="input-group-text">
                      <i :class="['bi', passwordFieldType === 'password' ? 'bi-eye-slash' : 'bi-eye', 'toggle-password']"
                        @click="togglePasswordVisibility('password')"></i>
                    </span>
                  </div>
                  <div v-if="showErrors && !v$.project.password.$pending && !v$.project.password.$model"
                    class="text-danger">
                    Password is required.
                  </div>
                </div>
              </div>

              <div class="col-md-6 mb-2">
                <div class="input-field">
                  <label for="confirmPassword">Confirm Password</label>
                  <div class="input-group">
                    <input v-model="project.confirmPassword" class="form-control" id="confirmPassword"
                      name="confirmPassword" :type="confirmPasswordFieldType" />
                    <span class="input-group-text">
                      <i :class="['bi', confirmPasswordFieldType === 'password' ? 'bi-eye-slash' : 'bi-eye', 'toggle-password']"
                        @click="togglePasswordVisibility('confirmPassword')"></i>
                    </span>
                  </div>
                  <div v-if="showErrors && !v$.project.confirmPassword.$pending && !v$.project.confirmPassword.$model"
                    class="text-danger">
                    Confirm Password is required.
                  </div>
                </div>
              </div>

              <div class="d-grid gap-2 col-6 mx-auto m-4">
                <div class="text-center">
                  <button type="submit" class="btn btn-primary" :disabled="isSaving">
                    Register
                  </button>
                </div>
                <div class="text-center">
                  <router-link to="/">
                    <button class="btn btn-link">Sign In</button>
                  </router-link>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </layout-div>
</template>

<script>
import { defineComponent } from 'vue';
import UserRegistrationForm from '@/mixins/UserRegistrationForm';
import LayoutDiv from '../LayoutDiv.vue';

export default defineComponent({
  name: 'UserRegister',
  mixins: [UserRegistrationForm],
  components: {
    LayoutDiv
  },
  setup() {
    // Access the mixin data
    return {
      ...UserRegistrationForm.setup()
    };
  }
});
</script>