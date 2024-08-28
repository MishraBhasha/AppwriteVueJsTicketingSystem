<script setup>
import { user } from "../store/user";
import { ref } from "vue";
const email = ref("");
const password = ref("");
</script>

<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-4 border rounded shadow" :style="{ backgroundColor: 'rgba(255, 255, 255, 0.25)' }">
        <h2 class="text-center m-5">Login</h2>
        <form>
          <div class="d-grid gap-2 col-9 mx-auto m-5">
            <div class="input-group">
              <input type="email" class="form-control shadow" placeholder="Email" v-model="email" />
            </div>
          </div>
          <div class="d-grid gap-2 col-9 mx-auto m-5">
            <div class="input-group">
              <input type="password" class="form-control shadow" placeholder="Password" v-model="password" />
            </div>
          </div>
          <div class="d-grid gap-2 col-9 mx-auto m-5">
            <button type="button" class="btn btn-primary" @click="user.login(email, password)">
              Login
            </button>
            <button type="button" class="btn btn-link" @click="user.register(email, password)">
              Register
            </button>
            <button type="button" @click="user.logout()">
              Logout
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
