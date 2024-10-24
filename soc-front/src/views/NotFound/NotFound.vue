<template>
    <div class="container-fluid bg-light min-vh-100 d-flex flex-column justify-content-center align-items-center">
      <div class="text-center">
        <img src="@/assets/logos/sinart-t-logo-con-nombre.png" alt="SINART Logo" class="mb-4" style="width: 200px;">
        <h1 class="display-1 fw-bold text-danger">404</h1>
        <h2 class="mb-4">¡Oops! Página no encontrada</h2>
        <p class="lead mb-5">Lo sentimos, la página que estás buscando no existe o ha sido movida.</p>
        <div class="d-flex justify-content-center gap-3">
          <button @click="goBack" class="btn btn-outline-primary">
            <i class="bi bi-arrow-left me-2"></i>Volver atrás
          </button>
          <router-link to="/" class="btn btn-danger">
            <i class="bi bi-house-door me-2"></i>Ir al inicio
          </router-link>
        </div>
      </div>
      <div class="mt-5">
        <p class="text-muted">¿Necesitas ayuda? <a href="#" @click.prevent="showContactInfo" class="text-decoration-none">Contáctanos</a></p>
      </div>
    </div>
  </template>
  
  <script>
  import { useRouter } from 'vue-router';
  
  export default {
    name: 'NotFound',
    setup() {
      const router = useRouter();
  
      const goBack = () => {
        router.go(-1);
      };
  
      const showContactInfo = () => {
        alert('Contacto: soporte@sinart.go.cr');
        // Aquí podrías abrir un modal con información de contacto más detallada
      };
  
      return {
        goBack,
        showContactInfo
      };
    }
  };
  </script>
  
  <style scoped>
  @import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css");
  
  .container-fluid {
    background-image: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  }
  
  h1 {
    font-size: 6rem;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
  }
  
  .btn {
    transition: all 0.3s ease;
  }
  
  .btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }
  </style>