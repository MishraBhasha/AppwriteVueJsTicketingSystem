<template>
    <div :class="['sidebar', { 'sidebar-collapsed': isCollapsed }]">
        <ul class="sidebar-menu">
            <li v-if="userRole === 'ADMIN'" class="nav-item" :class="{ active: isActive('/user/admin/list') }">
                <router-link to="/user/admin/list" class="nav-link">Dashboard</router-link>
            </li>
            <li v-if="userRole === 'ADMIN'" class="nav-item" :class="{ active: isActive('/user/admin/employeelist') }">
                <router-link to="/user/admin/employeelist" class="nav-link">Employee List</router-link>
            </li>
            <li v-if="userRole === 'ADMIN'" class="nav-item" :class="{ active: isActive('/user/admin/ticket/list') }">
                <router-link to="/user/admin/ticket/list" class="nav-link">Manage Ticket</router-link>
            </li>
            <li v-if="userRole === 'ADMIN'" class="nav-item" :class="{ active: isActive('/user/admin/priority/list') }">
                <router-link to="/user/admin/priority/list" class="nav-link">Manage Prority Type</router-link>
            </li>
            <li v-if="userRole === 'ADMIN'" class="nav-item" :class="{ active: isActive('/user/admin/company/list') }">
                <router-link to="/user/admin/company/list" class="nav-link">Manage Company</router-link>
            </li>
           

            <li v-if="userRole === 'Employee'" class="nav-item" :class="{ active: isActive('/user/emp/list') }">
                <router-link to="/user/emp/list" class="nav-link">Dashboard</router-link>
            </li>

            <li v-if="userRole === 'user'" class="nav-item" :class="{ active: isActive('/user/list') }">
                <router-link to="/user/list" class="nav-link">Dashboard</router-link>
            </li>
            <li v-if="userRole === 'user'" class="nav-item" :class="{ active: isActive('/user/create') }">
                <router-link to="/user/create" class="nav-link">Raise a Ticket</router-link>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'AppSidebar',
    props: {
        isCollapsed: {
            type: Boolean,
            required: true
        }
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
    },
    methods: {
        isActive(path) {
            return this.$route.path === path;
        },
    }
};
</script>

<style scoped>
.sidebar {
    margin-top: 75px;
    height: 100%;
    width: 250px;
    position: fixed;
    top: 0;
    left: 0;
    /* background-color: #c5b3e6; */
    background: linear-gradient(180deg, #7e64a8, #e19dd2);
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
    transition: width 0.3s;
    overflow: hidden;
}

.sidebar-collapsed {
    width: 0;
}

ul {
    list-style-type: none;
    padding: 0;
}

li {
    padding: 10px 20px;
}

.active {
    font-weight: bold;
    background-color: #060389;
    color: rgb(255, 255, 255);
}

.nav-link {
    display: block;
    /* color: inherit; */
    text-decoration: none;
    color: rgb(255, 255, 255);
}

.nav-link.active {
    color: rgb(255, 255, 255);
}
</style>