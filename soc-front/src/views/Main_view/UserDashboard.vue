<template>
  <div class="user-dashboard d-flex justify-content-center align-items-center">
    <div class="card p-4 shadow-lg" style="width: 22rem;">
      <div class="card-body text-center">
        <h2 class="mb-4">Selecciona tu Rol</h2>
        <div class="d-flex justify-content-center">
          <div class="row">
            <div v-for="role in roles" :key="role" class="col-12 col-md-6 mb-4">
              <div 
                class="role-card shadow d-flex align-items-center justify-content-center"
                @click="selectRole(role)"
                @mouseleave="hideTooltip(role)"
                :ref="`roleCard_${role}`"
              >
                <img :src="formatRole(role)" :alt="`Icono de ${role}`" class="role-icon img-fluid" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Tooltip } from 'bootstrap';

export default {
  data() {
    return {
      roles: JSON.parse(localStorage.getItem('roles')) || [],
      tooltips: {}
    };
  },
  mounted() {
    if (this.roles.length === 0) {
      this.$router.push('/login');
    } else {
      const selectedRole = localStorage.getItem('selectedRole');
      
      if (selectedRole) {
        const route = `/${selectedRole.toLowerCase()}`;
        console.log(`Redirigiendo a: ${route}`);
        this.$router.push(route).catch(err => {
          console.error('Error al redirigir:', err);
        });
      } else if (this.roles.length === 1) {
        const role = this.roles[0];
        localStorage.setItem('selectedRole', role);
        this.$router.push(`/${role.toLowerCase()}`);
      }
    }
    this.initTooltips();
  },
  methods: {
    selectRole(role) {
      this.hideTooltip(role);
      
      localStorage.setItem('selectedRole', role);
      const route = `/${role.toLowerCase()}`;
      console.log(`Redirigiendo a: ${route}`);
      this.$router.push(route).catch(err => {
        console.error('Error al redirigir:', err);
      });
    },
    formatRole(role) {
      return `/icos/${role.toLowerCase()}.png`;
    },
    initTooltips() {
      this.roles.forEach(role => {
        const element = this.$refs[`roleCard_${role}`][0];
        this.tooltips[role] = new Tooltip(element, {
          title: role,
          placement: 'top',
          trigger: 'hover'
        });
      });
    },
    hideTooltip(role) {
      if (this.tooltips[role]) {
        this.tooltips[role].hide();
      }
    }
  }
};
</script>

<style scoped>
.user-dashboard {
   height: calc(80vh - 56px); /*Ajusta este valor según la altura de tu navbar */
  overflow-y: auto;
  padding: 20px;
}

.card {
  background-color: #ffffff;
  border-radius: 0.5rem;
}

.role-card {
  cursor: pointer;
  transition: transform 0.2s ease;
  background-color: #bad2ea;
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  padding: 1rem;
  text-align: center;
}

.role-card:hover {
  transform: scale(1.05);
  background-color: #76b3ef;
}

.role-icon {
  width: 50px;
  height: 50px;
  object-fit: contain;
}
</style>