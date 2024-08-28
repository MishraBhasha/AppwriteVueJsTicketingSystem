<template>
  <header class="fixed-top header">
    <div class="navbar-menu-wrapper d-flex align-items-top m-2">
      <ul class="navbar-nav">
        <li class="nav-item fw-semibold d-none d-lg-block">
          <div class="d-flex align-items-center">
            <i v-if="isSidebarCollapsed" class="bi bi-justify-left fs-3 me-3 text-white"
              @click="$emit('toggle-sidebar')"></i>
            <i v-else class="bi bi-justify-right fs-3 me-3 text-white" @click="$emit('toggle-sidebar')"></i>
            <img :src="logoSrc" alt="Logo" height="50" width="180" class="logo" />
          </div>
        </li>
      </ul>

      <ul class="navbar-nav ms-auto">
        <!-- <li class="nav-item dropdown d-lg-block user-dropdown">
          <a class="nav-link dropdown-toggle text-white" id="UserDropdown" href="#" data-bs-toggle="dropdown"
            aria-expanded="false">         
            <i class="bi bi-person-circle fs-2"></i>{{formattedEmail}}
          </a>
          <ul class="dropdown-menu dropdown-menu-right navbar-dropdown" aria-labelledby="UserDropdown">
            <li>
              <a class="dropdown-item text-center" @click="logout">
                <i class="bi bi-sign-turn-slight-right me-md-2"></i>Logout
              </a>
            </li>
          </ul>
        </li> -->
        <li class="nav-item dropdown d-lg-block user-dropdown">
          <div @click="toggleDropdown" class="nav-link text-white dropdown-toggle" ref="dropdownTrigger">
            <i class="bi bi-person-circle fs-2"></i> {{ user }}
          </div>
          <div v-if="isDropdownOpen" class="dropdown-menu dropdown-menu-end" ref="dropdownMenu">
            <a class="dropdown-item text-center" @click="logout">
              <i class="bi bi-sign-turn-slight-right me-md-2"></i> Logout
            </a>
          </div>
        </li>
      </ul>
    </div>
  </header>
</template>

<script>
import logo from '@/assets/Tlogo.png';

export default {
  name: 'AppHeader',
  props: {
    isSidebarCollapsed: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      logoSrc: logo,
      isDropdownOpen: false
    };
  },
  computed: {
    user() {
      return this.$store.getters.getUser;
    },
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    },
    userRole() {
      return this.$store.getters.getRole;
    },
    // formattedEmail() {
    // //   const email = this.user.replace(/"/g, '');
    //   return this.user.split('@')[0]; // Extract the part before '@'
    // }
  },
  mounted() {
    console.log('UUUU:', this.user);
    // console.log('User:', this.user.replace(/"/g, ''));
    console.log('Role User:', this.userRole);
    document.addEventListener('click', this.handleClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  },
  methods: {
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    logout() {
      this.$store.dispatch('logout');
      this.$router.push('/');
    },
    closeDropdown() {
      this.isDropdownOpen = false;
    },
    handleClickOutside(event) {
      const dropdownTrigger = this.$refs.dropdownTrigger;
      const dropdownMenu = this.$refs.dropdownMenu;
      
      // Check if the click was outside both the trigger and the menu
      if (dropdownTrigger && !dropdownTrigger.contains(event.target) &&
          dropdownMenu && !dropdownMenu.contains(event.target)) {
        this.closeDropdown();
      }
    },
  }
  
};
</script>

<style scoped>
.header {
  /* background-color: #c5b3e6; */
  /* background-color: #b590fa; */
  /* background-color: #8B2D6C;  */
  background: linear-gradient(90deg, #e19dd2, #7e64a8);
}
.dropdown-menu {
  display: block;
  position: absolute;
  background-color: #fff;
  border: 1px solid #ccc;
  z-index: 1000;
}
.dropdown-menu-end {
  right: 0;
}
</style>
