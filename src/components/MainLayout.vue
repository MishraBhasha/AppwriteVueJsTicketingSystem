<template>
  <div>   
    <AppHeader :isSidebarCollapsed="isSidebarCollapsed" @toggle-sidebar="toggleSidebar" />
    <AppSidebar :isCollapsed="isSidebarCollapsed" />
    <div :class="['main-content', { collapsed: isSidebarCollapsed }]">
      <slot></slot>
      <router-view></router-view>
    </div>
    <AppFooter />
  </div>
</template>

<script>
import AppHeader from './pages/AppHeader.vue';
import AppSidebar from './pages/AppSidebar.vue';
import AppFooter from './pages/AppFooter.vue';

export default {
  name: 'MainLayout',
  components: {
    AppHeader,
    AppSidebar,
    AppFooter,
  },
  data() {
    return {
      isSidebarCollapsed: false
    };
  },
  methods: {
    toggleSidebar() {
      this.isSidebarCollapsed = !this.isSidebarCollapsed;
    }
  }
};
</script>

<style scoped>
.main-content {
  display: flex;
  transition: margin-left 0.3s;
  margin-left: 250px;
  margin-top: 20px;
  padding: 1rem;
}

.main-content.collapsed {
  margin-left: 0;
}

.main-content:not(.collapsed) {
  margin-left: 250px;
}

.content {
  flex: 1;
  margin-top: 20px;
  padding: 1rem;
}
</style>
