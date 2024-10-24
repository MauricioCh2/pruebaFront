<template>
  <div v-if="$route.name !== 'Login'">
    <div class="logo-container m-2">
      <img src="@/assets/logos/sinart-t-logo-con-nombre.png" width="150" alt="SINART Logo" class="logo" />
    </div>
    <header class="bg-danger text-white py-0">
      <div class="container-fluid">
        <nav class="navbar navbar-expand-lg navbar-dark">
          <div class="navbar-nav ms-auto">
            <div class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="bi bi-person-circle"></i> {{ user.name }}
              </a>
              <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                <li><a class="dropdown-item" href="#" @click="openUserInfo"><i class="bi bi-info-circle"></i> Ver información</a></li>
                <li><a class="dropdown-item" href="#" @click="logout"><i class="bi bi-box-arrow-right"></i> Cerrar sesión</a></li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </header>

    <!-- Offcanvas para información del usuario -->
    <div class="offcanvas offcanvas-end" tabindex="-1" id="userInfoOffcanvas" aria-labelledby="userInfoOffcanvasLabel">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="userInfoOffcanvasLabel">Información del Usuario</h5>
        <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body">
        <p><strong><i class="bi bi-person-vcard"></i> ID:</strong> {{ user.id }}</p>
        <p><strong><i class="bi bi-envelope"></i> Email:</strong> {{ user.email }}</p>
        <p><strong><i class="bi bi-telephone"></i> Teléfono:</strong> {{ user.telefono }}</p>
        <p><strong><i class="bi bi-person-gear"></i> {{ user.roles_v.length !== 1 ? 'Roles' : 'Rol' }}:</strong></p>
        <ul class="list-group">
          <li v-for="role in user.roles_v" :key="role.id" class="list-group-item d-flex justify-content-between align-items-center">
            {{ role.nombre }}
            <button v-if="user.roles_v.length > 1" @click="switchRole(role)" class="btn btn-outline-primary btn-sm">Cambiar a este rol</button>
          </li>
        </ul>
        <br>
        <button @click="confirmPasswordChange" class="btn btn-danger">Cambiar contraseña</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Offcanvas } from 'bootstrap';
import PopUps from '@/services/PopUps';

export default {
  name: 'NavbarUser',
  setup() {
    const router = useRouter();
    const user = ref({
      id: '',
      name: '',
      email: '',
      telefono: '',
      roles_v: []
    });

    const openUserInfo = () => {
      const offcanvasElement = document.getElementById('userInfoOffcanvas');
      if (offcanvasElement) {
        const offcanvas = new Offcanvas(offcanvasElement);
        offcanvas.show();
      }
    };

    const logout = () => {
      localStorage.clear();
      router.push('/');
    };

    const switchRole = (role) => {
      console.log('Cambiando al rol:', role);
      const route = `/${role.nombre.toLowerCase()}`;
      console.log(`Redirigiendo a: ${route}`);
      localStorage.setItem('selectedRole', role.nombre);
      router.push(route).catch(err => {
        console.error('Error al redirigir:', err);
      });
    };

    const confirmPasswordChange = async () => { //Pop up de confirmacion de cambio de
      const result = await PopUps.showConfirmationPopup(
        '¿Estás seguro de que deseas cambiar tu contraseña?',
        'Confirmar cambio de contraseña',
        'Sí, cambiar',
        'No, cancelar'
      );

      if (result.isConfirmed) {
        showPasswordChangePopup();
      }
    };

    const showPasswordChangePopup = async () => {
      const { value: formValues } = await PopUps.showBasicPopup(`
        <form>
          <div class="mb-3">
            <label for="currentPassword" class="form-label">Contraseña actual</label>
            <input type="password" id="currentPassword" class="form-control" required>
          </div>
          <div class="mb-3">
            <label for="newPassword" class="form-label">Nueva contraseña</label>
            <input type="password" id="newPassword" class="form-control" required>
          </div>
          <div class="mb-3">
            <label for="confirmPassword" class="form-label">Confirmar nueva contraseña</label>
            <input type="password" id="confirmPassword" class="form-control" required>
          </div>
        </form>
      `, 'Cambiar contraseña');

      if (formValues) {
        // Aquí iría la lógica para cambiar la contraseña
        console.log('Cambiando contraseña...');
        // Si sale bien 
        await PopUps.showTimedPopup('Contraseña cambiada exitosamente', 'Éxito', 2000);
      }
    };

    onMounted(() => {
      user.value.id = localStorage.getItem('cedula');
      user.value.name = localStorage.getItem('nombreCompleto');
      user.value.email = localStorage.getItem('correo');
      user.value.telefono = localStorage.getItem('telefono');
      
      const roles = localStorage.getItem('roles');
      user.value.roles_v = roles ? JSON.parse(roles).map((role, index) => ({ id: index + 1, nombre: role })) : [];
    });

    return {
      user,
      openUserInfo,
      logout,
      switchRole,
      confirmPasswordChange,
    };
  }
};
</script>

<style scoped>
.nav-link {
  cursor: pointer;
}

.offcanvas {
  width: 300px;
}
</style>