import axios from 'axios';

export default {
  async fetchUsers() {
    
      const response = await axios.get('/usuarios');
      // Mapea los datos recibidos para que coincidan con las propiedades que usas
      return response.data.map(user => ({
        id: user.CEDULA,
        completeName: `${user.NOMBRE} ${user.PRIMER_APELLIDO} ${user.SEGUNDO_APELLIDO}`,
        name: user.NOMBRE,
        lName: user.PRIMER_APELLIDO,
        slName: user.SEGUNDO_APELLIDO,
        email: user.CORREO,
        telefono: user.TELEFONO,
        roles_v: user.roles.map(rol => ({
          id: rol.pk_codigo_rol,
          nombre: rol.nombre_rol
        })),
        estado: user.HABILITADO
      }));
    
  }
};
