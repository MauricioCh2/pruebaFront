import axios from 'axios';
import ColorsService from '@/services/Colors.js';

const AuthService = {
  async login(cedula, contrasenia) {
    try {
      const response = await axios.post('/usuarios/login', { CEDULA: cedula, CONTRASENIA: contrasenia });
      const { token, role, User } = response.data;

      // Extraer los datos adicionales del usuario
      const { CEDULA, NOMBRE, PRIMER_APELLIDO, SEGUNDO_APELLIDO, CORREO, TELEFONO, HABILITADO } = User;

      ColorsService.print('Usuario logueado con éxito', 'green');
      ColorsService.log('green', 'Data:', response.data); 
      
      // Almacenar el token, roles y demás datos en localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('roles', JSON.stringify(role));
      localStorage.setItem('cedula', CEDULA);
      localStorage.setItem('nombreCompleto', `${NOMBRE} ${PRIMER_APELLIDO} ${SEGUNDO_APELLIDO}`);
      localStorage.setItem('correo', CORREO);
      localStorage.setItem('telefono', TELEFONO);
      localStorage.setItem('habilitado', HABILITADO);


      // Retorna los roles para manejar la redirección en el componente
      return role;
    } catch (error) {
      console.error('Error al hacer login:', error);
      throw new Error('Cédula o contraseña incorrecta');
    }
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('roles');
    localStorage.removeItem('cedula');
    localStorage.removeItem('nombreCompleto');
    localStorage.removeItem('correo');
    localStorage.removeItem('telefono');
  },

  getToken() {
    return localStorage.getItem('token');
  },

  isLoggedIn() {
    return !!localStorage.getItem('token');
  }
};

export default AuthService;