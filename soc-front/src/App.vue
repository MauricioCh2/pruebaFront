<template>
  <div id="app">
    <div v-if="$route.name !== 'Login' && $route.name !== 'NotFound'"> 
      <NavbarUser />

    </div >
    <div class="main-content">
      <router-view />

    </div>
   </div> 
</template>

<script>

import NavbarUser from '@/components/NavbarUser.vue';
export default {
  name: 'App',
  components: {
    NavbarUser
  }
};

</script>

<style scoped>
#app {
  background-image: url('@/assets/backgounds/fondo-SINART.jpeg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

</style>