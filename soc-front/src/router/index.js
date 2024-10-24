import { createRouter, createWebHistory } from 'vue-router';
import Login from '@/components/UserLogin.vue';
import UserDashboard from '@/views/Main_view/UserDashboard.vue';
import ValidacionDashboard from '@/views/Validacion_view/ValidacionDashboard.vue';
import SupervisionDashboard from '@/views/Supervision_view/SupervisionDashboard.vue';
import PresupuestoDashboard from '@/views/Presupuesto_view/PresupuestoDashboard.vue';
import RegistroDashboard from '@/views/Registro_view/RegistroDashboard.vue';
import AdminDashboard from '../views/Administrador_view/AdminDashboard.vue';
import ColorsService from '@/services/Colors';

//
const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/user',
    name: 'UserDashboard',
    component: UserDashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/validacion',
    name: 'ValidacionDashboard',
    component: ValidacionDashboard,
    meta: { requiresAuth: true, role: 'Validacion' }
  },
  {
    path: '/supervision',
    name: 'SupervisionDashboard',
    component: SupervisionDashboard,
    meta: { requiresAuth: true, role: 'Supervision' }
  },
  {
    path: '/presupuestario',
    name: 'PresupuestoDashboard',
    component: PresupuestoDashboard,
    meta: { requiresAuth: true, role: 'Presupuestario' }
  },
  {
    path: '/administrador',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true, role: 'Administrador' }
  },
  {
    path: '/registro',
    name: 'RegistroDashboard',
    component: RegistroDashboard,
    meta: { requiresAuth: true, role: 'Registro' }
  },
  //Catch a todas las rutas no definidas
  {
    path: '/:pathMatch(.*)*', 
    name: 'NotFound',
    component: () => import('@/views/NotFound/NotFound.vue')  // Redirige a una vista de error 404
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const userRoles = JSON.parse(localStorage.getItem('roles')) || [];
  const isAuthenticated = !!localStorage.getItem('token');
  const selectedRole = localStorage.getItem('selectedRole');
  
  console.log('Roles del usuario:', userRoles);
  console.log('Ruta a la que se intenta acceder:', to.fullPath);

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      ColorsService.print('Usuario no autenticado', 'red');
      return next({ path: '/login' });
    }

    if (selectedRole && userRoles.includes(selectedRole)) {
      ColorsService.print('Solo tengo un rol', 'orange');
      if (to.meta.role && to.meta.role !== selectedRole && localStorage.getItem('user.estado') === 1) {
        return next({ path: `/${selectedRole.toLowerCase()}` });
      }
    } else if (userRoles.length > 1 && to.name !== 'UserDashboard') {
      return next({ path: '/user' });
    }

    if (to.meta.role && !userRoles.includes(to.meta.role)) {
      return next({ path: '/user' });
    }
  }

  ColorsService.print('Acceso permitido', 'green');
  next();
});

export default router;