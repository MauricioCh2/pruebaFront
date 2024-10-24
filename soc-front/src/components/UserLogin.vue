<template>
  <div id="app" class="container d-flex justify-content-center align-items-center" style="height: 100vh;">
    <div class="card p-4 shadow-lg" style="width: 22rem;">
      <div class="card-body text-center">
        <h3 class="mb-3">Iniciar sesión en Sinart</h3>

        <form @submit.prevent="login">
          <div class="form-group">
            <label for="cedula">Cédula</label>
            <input 
              type="text" 
              class="form-control" 
              id="cedula" 
              placeholder="Ingrese su cédula" 
              v-model="cedula" 
              required 
            />
          </div>

          <div class="form-group">
            <label for="contrasenia">Contraseña</label>
            <input 
              type="password" 
              class="form-control" 
              id="contrasenia" 
              placeholder="Ingrese su contraseña" 
              v-model="contrasenia" 
              required 
            />
          </div>

          <div class="form-group form-check">
            <input 
              type="checkbox" 
              class="form-check-input" 
              id="captcha" 
              v-model="captcha" 
            />
            <label class="form-check-label" for="captcha">No soy un robot</label>
          </div>

          <button type="submit" class="btn btn-primary w-100">Ingresar</button>

          <small class="d-block mt-3">
            <a href="#">¿Olvidaste tu contraseña?</a>
          </small>
        </form>

        <p v-if="error" class="text-danger mt-2">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import AuthService from '@/store/auth';

export default {
  data() {
    return {
      cedula: '',
      contrasenia: '',
      captcha: false,
      error: ''
    };
  },
  methods: {
    async login() {
      try {
        await AuthService.login(this.cedula, this.contrasenia);
        const roles = JSON.parse(localStorage.getItem('roles'));

        // Redirigir al usuario dependiendo de sus roles
        if (roles.length === 1) {
          this.$router.push(`/${roles[0].toLowerCase()}`);
        } else {
          this.$router.push('/user');
        }
      } catch (error) {
        this.error = 'Cédula o contraseña incorrecta';
      }
    }
  }
};
</script>