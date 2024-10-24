<template>
  <div class="d-flex justify-content-between align-items-center mb-4 mt-3 mx-4">
  <!-- Botón para agregar un usuario -->
  <button @click="addUser" class="btn btn-success">
    <i class="bi bi-person-add"></i>
    Agregar Usuario
  </button>

  <!-- Input para buscar usuarios -->
  <div class="input-group" style="width: 250px;">
    <input 
      type="text" 
      class="form-control" 
      placeholder="Buscar usuario..." 
      v-model="searchQuery"
      @input="searchUser"
    />
    <div class="input-group-append">
      <span class="input-group-text">
        <i class="bi bi-search"></i>
      </span>
    </div>
  </div>
</div>

<div class = "mx-4">
  <h2>Lista de Usuarios</h2>
  <div class="mx-5" style="max-height: 700px; overflow-y: auto;">
    <table class="table table-striped">
      <thead class="table-dark">
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Email</th>
          <th>Teléfono</th>
          <th>Roles</th>
          <th>Detalles</th>
        </tr>
      </thead>

        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.telefono }}</td>
            <td>{{ user.roles_v.map(role => role.nombre).join(', ') }}</td>
            <td>
              <button @click="infoUser(user)" class="btn btn-info">
                <img src="@/assets/icos/info-circle.svg" class="bi bi-info-circle" />
              
              </button>
            </td>
          </tr>
        </tbody>
      </table>
  </div>
  </div>

<!-- Componente PageNavigator al final de la tabla -->
<PageNavigator 
    :currentPage="currentPage" 
    :totalPages="totalPages" 
    @changePage="changePage"
  />

</template>



<script src="./AdminDashboard_log.js"> </script>

<style scoped>

.input-group-append .input-group-text {
cursor: pointer;
}

.table-secondary {
  opacity: 0.7;
}

.btn-secondary {
  opacity: 0.8;
}


</style>