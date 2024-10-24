import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import 'bootstrap'; //Importar los scrips de bootstrap
import 'bootstrap-icons/font/bootstrap-icons.css'; //importa icono de bootstrap 
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


// Configurar Axios para usar la URL base de la API
axios.defaults.baseURL = 'http://127.0.0.1:8000/api';

const app = createApp(App);

app.config.globalProperties.$axios = axios;

app.use(router).mount('#app');