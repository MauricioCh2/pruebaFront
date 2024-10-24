import Swal from 'sweetalert2';
import axios from 'axios'; 
import PageNavigator from '@/components/PageNavigation.vue';
import AdminService from '@/views/Administrador_view/AdminService.js';
import Constants from '@/services/Constants';
import ColorsService from '@/services/Colors';
import * as bootstrap from 'bootstrap'; 
export default {
  data() {
    return {
      users: [],
      searchQuery: '', //necesario para la busqueda parcial de front
      currentPage: 1, //pagina actual
      itemsPerPage: 10, //mumero de pagina 
    };
  },
  mounted() { //Al empezar hara: 
    this.fetchUsers() 
  },
  components: { //Componentes que puede llamar: 
    PageNavigator
  },
  computed: {
    filteredUsers() {
      return this.users.filter(user =>
        user.name? user.name.toLowerCase().includes(this.searchQuery.toLowerCase()) : '' ||
        user.email? user.email.toLowerCase().includes(this.searchQuery.toLowerCase()) : '' ||
        (user.id ? user.id.includes(this.searchQuery) : '') 
      );
    },
    paginatedUsers() {
      // Calcula el índice de los elementos a mostrar según la página actual
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredUsers.slice(start, end);
    },
    totalPages() {
      // Calcula el número total de páginas
      return Math.ceil(this.filteredUsers.length / this.itemsPerPage);
    }
  },
  methods: {// Metodos 
    // Método para cambiar de página
    changePage(page) {
      this.currentPage = page;
    },
    // Verificar si la página actual es la primera
    isFirstPage() {
      return this.currentPage === 1;
    },
    // Verificar si la página actual es la última
    isLastPage() {
      return this.currentPage === this.totalPages;
    },
    async fetchUsers() { //Sincroniza los usuarios con la DB 
      try {
        this.users = await AdminService.fetchUsers();
        console.log("Usuarios cargados: ", this.users);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          this.$swal('Información', 'No hay usuarios registrados', 'info');
        } else {
          this.$swal('Error', 'Error al cargar usuarios', 'error');
        }
      }
    },


    editUser(user) {
      this.manageUser('edit', user);
    },
    addUser() { 
      this.manageUser('add');
    },


    // Agregar o editar usuario
    manageUser(action, user = {}) {
      const predefinedRoles = Constants.getPredefinedRoles(); 
      let selectedRoles = user.roles_v ? [...user.roles_v] : [];
      ColorsService.print('Datos del usuario:', 'cyan');
      ColorsService.log('cyan', user);

      Swal.fire({
        title: action === 'add' ? 'Agregar Nuevo Usuario' : 'Editar Usuario',
        html: this.generateUserForm(user, predefinedRoles, selectedRoles),
        width: '650px',
        showCancelButton: true,
        confirmButtonText: action === 'add' ? 'Agregar' : 'Guardar',
        didOpen: () => {
          const addRoleBtn = document.getElementById('addRoleBtn');
          if (addRoleBtn) {
            addRoleBtn.addEventListener('click', () => {
              this.addRole(selectedRoles);
              this.updateRolesTable(selectedRoles);
            });
          }
          this.setupRemoveRoleListeners(selectedRoles);
          
          // Inicializar los dropdowns
          const dropdownTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="dropdown"]'));
          dropdownTriggerList.forEach((dropdownTriggerEl) => {
            new bootstrap.Dropdown(dropdownTriggerEl);
          });
        },
        preConfirm: () => {
          const inputs = this.getFormInputs(['name', 'lName', 'slName', 'id', 'email', 'telefono']);
          const validation = this.validateForm(inputs, selectedRoles);
  
          if (!validation.isValid) return false;
  
          const password = action === 'add' ? Math.random().toString(36).slice(-8) : user.password;
          return {
            CEDULA: inputs.id,
            NOMBRE: inputs.name,
            PRIMER_APELLIDO: inputs.lName,
            SEGUNDO_APELLIDO: inputs.slName,
            CORREO: inputs.email,
            TELEFONO: inputs.telefono,
            CONTRASENIA: password,
            roles: selectedRoles.map(role => role.id)
          };
        }
      }).then(result => {
        if (result.isConfirmed) {
          this.saveUser(result.value, action);
        }
      });
    },
    // Generar formulario reutilizable para agregar/editar
    generateUserForm(user, predefinedRoles, selectedRoles) {
      return `
        <div class="container-fluid p-0">
          ${this.generateInputField('name', 'Nombres', 'bi-person-vcard', user.name || '')}
          ${this.generateInputField('lName', 'Primer Apellido', 'bi-person-vcard', user.lName || '')}
          ${this.generateInputField('slName', 'Segundo Apellido', 'bi-person-vcard', user.slName || '')}
          ${this.generateInputField('id', 'Identificación', 'bi-person-vcard', user.id || '', user.id ? true : false)}
          ${this.generateInputField('email', 'Correo', 'bi-envelope', user.email || '')}
          ${this.generateInputField('telefono', 'Teléfono', 'bi-telephone', user.telefono || '')}
          ${this.generateRoleDropdown(predefinedRoles)}
        </div>
        ${this.generateRoleTable(selectedRoles)}
      `;
    },
  
    // Reutilización de inputs
    generateInputField(id, label, icon, value = '', disabled = false) {
      return `
        <div class="row mb-3">
          <div class="col-4 text-end">
            <label for="${id}"><i class="bi ${icon}"></i> ${label}:</label>
          </div>
          <div class="col-8">
            <input id="${id}" class="form-control" value="${value}" placeholder="${label}" ${disabled ? 'disabled' : ''}>
          </div>
        </div>
      `;
    },
  
    generateRoleDropdown(roles) { //Genera un dropdown con los roles predefinidos
      ColorsService.print('Roles predefinidos:', 'cyan');
      ColorsService.log('cyan', roles);
      return ` 
        <div class="row mb-3">
          <div class="col-4 text-end">
            <label for="rolesDropdown"><i class="bi bi-person-badge"></i> Rol:</label>
          </div>
          <div class="col-8">
            <div class="input-group">
              <select id="rolesDropdown" class="form-select">
                <option value="" disabled selected>Selecciona un rol</option>
               ${roles.map(role => `<option value="${role.id}">${role.nombre}</option>`).join('')}
          </select>

              </select>
              <button id="addRoleBtn" class="btn btn-info">Añadir</button>
            </div>
          </div>
        </div>
        `
      ;
    },
    setupRemoveRoleListeners(selectedRoles) {
      const removeButtons = document.querySelectorAll('.remove-role-btn');
      removeButtons.forEach((button) => {
        button.onclick = () => {
          const index = parseInt(button.getAttribute('data-index'));
          selectedRoles.splice(index, 1);
          this.updateRolesTable(selectedRoles);
          this.setupRemoveRoleListeners(selectedRoles);
          return false; // Previene que el modal se cierre
        };
      });
    },

    generateRoleTable(selectedRoles) {
      ColorsService.print('Roles seleccionados:', 'cyan');
      ColorsService.log('cyan', selectedRoles);
      return `
        <table id="rolesTable" class="table swal2-table">
          <thead>
            <tr>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody id="rolesTableBody">
            ${selectedRoles.map((role, index) => `
              <tr>
                <td>
                  <div class="dropdown">
                    <span class="dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                      ${role.nombre}
                    </span>
                    <ul class="dropdown-menu">
                      <li><a class="dropdown-item" href="#">${role.descripcion || 'Sin descripción'}</a></li>
                    </ul>
                  </div>
                </td>
                <td>
                  <button class="btn btn-danger btn-sm remove-role-btn" data-index="${index}">Eliminar</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    },

   updateRolesTable(selectedRoles) {
  const tableBody = document.getElementById('rolesTableBody');
  if (tableBody) {
    tableBody.innerHTML = selectedRoles.map((role, index) => `
      <tr>
        <td>
          <div class="dropdown">
            <span class="dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
              ${role.nombre}
            </span>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" href="#">${role.descripcion || 'Sin descripción'}</a></li>
            </ul>
          </div>
        </td>
        <td>
          <button class="btn btn-danger btn-sm remove-role-btn" data-index="${index}">Eliminar</button>
        </td>
      </tr>
    `).join('');
    this.setupRemoveRoleListeners(selectedRoles);
    
    // Inicializar los nuevos dropdowns
    const dropdownTriggerList = [].slice.call(tableBody.querySelectorAll('[data-bs-toggle="dropdown"]'))
    dropdownTriggerList.forEach(function (dropdownTriggerEl) {
      new bootstrap.Dropdown(dropdownTriggerEl)
    });
  }
},


    removeRole(index) {
      this.selectedRoles.splice(index, 1);
      this.updateRolesTable(this.selectedRoles);
    },


    addRole(selectedRoles) {
      const dropdown = document.getElementById('rolesDropdown');
      const selectedOption = dropdown.options[dropdown.selectedIndex];
      if (selectedOption.value && !selectedRoles.some(role => role.id === selectedOption.value)) {
        const selectedRole = Constants.getPredefinedRoles().find(role => role.id === parseInt(selectedOption.value));
        selectedRoles.push({
          id: selectedOption.value,
          nombre: selectedOption.text,
          descripcion: selectedRole ? selectedRole.descripcion : 'Sin descripción'
        });
        this.updateRolesTable(selectedRoles);
      }
    },
  
    getFormInputs(inputIds) {
      return inputIds.reduce((inputs, id) => {
        inputs[id] = document.getElementById(id).value;
        return inputs;
      }, {});
    },
  
    validateForm(inputs, selectedRoles) {
      // Validación compartida (misma lógica que la anterior)
      const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,40}$/;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      const phoneRegex = /^[\d\s\-+#]{7,15}$/;
      const idRegex = /^[\d\s\--]{7,9}$/;
  
      let isValid = true;
      const validations = [
        { field: 'name', value: inputs.name, regex: nameRegex, message: 'El nombre debe tener entre 5 y 40 caracteres y solo puede contener letras' },
        { field: 'lName', value: inputs.lName, regex: nameRegex, message: 'El primer apellido debe tener entre 5 y 40 caracteres y solo puede contener letras' },
        { field: 'slName', value: inputs.slName, regex: nameRegex, message: 'El segundo apellido debe tener entre 5 y 40 caracteres y solo puede contener letras' },
        { field: 'id', value: inputs.id, regex: idRegex, message: 'La identificación debe tener entre 7 y 9 caracteres y solo puede contener números' },
        { field: 'email', value: inputs.email, regex: emailRegex, message: 'Por favor, introduce un correo electrónico válido' },
        { field: 'telefono', value: inputs.telefono, regex: phoneRegex, message: 'El número de teléfono es incorrecto' }
      ];
  
      validations.forEach(validation => {
        if (!validation.regex.test(validation.value)) {
          Swal.showValidationMessage(validation.message);
          document.getElementById(validation.field).classList.add('is-invalid', 'shake');
          isValid = false;
        }
      });
  
      if (selectedRoles.length === 0) {
        Swal.showValidationMessage('Debes seleccionar al menos un rol');
        isValid = false;
      }
  
      return { isValid, userData: inputs };
    },
  
    saveUser(userData, action) {
      ColorsService.print('Datos del usuario:', 'cyan');
      ColorsService.log('cyan', userData);
      const url = action === 'add' ? '/usuarios' : `/usuarios/${userData.CEDULA}`;
      const method = action === 'add' ? 'post' : 'put';
  
      axios[method](url, userData)
        .then(response => {
          console.log('Usuario guardado:', response.data);
          Swal.fire('Usuario guardado', '', 'success');
          this.fetchUsers();
        })
        .catch(error => {
          Swal.fire('Error al guardar usuario', error.response.data.message, 'error');
        });
    },
  searchUser() {//Buscar usuario ----------------------------------------------------------------------------------------------
    // La búsqueda se gestiona automáticamente mediante filteredUsers
    //Pero puede que en un futuro si se añada bastante logica aca
  },
  
    disableUser(id,estado) {
      Swal.fire({
        title: '¿Estás seguro?',
        text: "¡El usuario sera inhabilitado!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: estado ? 'Sí, inhabilitar' : 'Sí, habilitar',
    }).then(async result => {
        if (result.isConfirmed) {
            await axios.patch('/usuarios/' + id, { HABILITADO: !estado })
                .then(() => {
                    Swal.fire({
                        title: 'Éxito',
                        text: 'El estado del usuario se actualizó correctamente.',
                        icon: 'success',
                    });
                })
                .catch(() => {
                    Swal.fire({
                        title: 'Error',
                        text: 'Hubo un problema al actualizar el estado del usuario.',
                        icon: 'error',
                    });
                });
          this.fetchUsers();
        }
    });
    },
    infoUser(user) {
      Swal.fire({
        title: `<strong>Información de ${user.name}</strong>`,
        html: `
          <p><strong><i class="bi bi-person-vcard"></i> ID:</strong> ${user.id}</p>
          <p><strong><i class="bi bi-envelope"></i> Email:</strong> ${user.email}</p>
          <p><strong><i class="bi bi-telephone"></i> Teléfono:</strong> ${user.telefono}</p>
          <p><strong><i class="bi bi-person-gear"></i> ${user.roles_v.length!==1? `Roles`: `Rol`}:</strong> ${user.roles_v.map(role => role.nombre).join(', ')}</p>
          <br>
          <button id="edit-user" class="swal2-confirm swal2-styled" style="background-color: #3085d6;">Editar</button>
          <button id="toggle-user" class="swal2-cancel swal2-styled" style="background-color: ${user.estado === 0 ? '#3085d6' : '#d33'};">
            ${user.estado === 0 ? 'Habilitar' : 'Inhabilitar'}
          </button>
        `,
        showCancelButton: false,
        showConfirmButton: false,
        showCloseButton: true,
        didOpen: () => {
            const editButton = Swal.getPopup().querySelector('#edit-user');
            editButton.addEventListener('click', () => {
                this.editUser(user);
            });
    
            const toggleButton = Swal.getPopup().querySelector('#toggle-user');
            toggleButton.addEventListener('click', () => {
                this.disableUser(user.id,user.estado); // Método para inhabilitar al usuario
            });
        }
    });
    }
  }
};