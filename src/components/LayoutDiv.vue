<template>
    <div :class="['container-fluid', currentPageClass]">
        <slot></slot>
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    name: 'LayoutDiv',
    computed: {
        currentPageClass() {
            return this.$route.name === 'Login' || this.$route.name === 'Register' ? 'auth-page' : '';
        }
    }
};
</script>
<style scoped>
.container-fluid.auth-page {
    background-image: url('@/assets/TicketingSystems.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    display: flex;
    justify-content: center;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    height: 100vh;
}
</style>
