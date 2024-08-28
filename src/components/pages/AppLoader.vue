<!-- Loader.vue -->
<template>
    <div class="card">
        <div class="card-body">
             <div class="loader">
        <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
        </div>
    </div>
   
</template>

<script>
export default {
    name: 'AppLoader',
};
</script>

<style scoped>
.loader {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 9999;
}
</style>