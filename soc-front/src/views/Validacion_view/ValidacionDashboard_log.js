
import { ref, computed, onMounted } from 'vue';
import PageNavigator from '@/components/PageNavigation.vue';
//import ColorsService from '@/services/Colors';//IOmporta la liubreria de colores 
import ValidacionService from './ValidacionService';
import { h, createApp } from 'vue';
import Swal from 'sweetalert2';
import OrdenDeCompraDetalle from './OrdenDeCompraDetalle.vue';

//import OrdenDeCompraDetalle from './OrdenDeCompraDetalle.vue';
//import { useModal } from '@/composables/useModal';

export default {
  name: 'PurchaseOrdersDashboard',
  components: {
    PageNavigator,
    //OrdenDeCompraDetalle
  },
  setup() {
    // Estado de órdenes de compra, paginación, y filtros
    const purchaseOrders = ref([]);
    const currentPage = ref(1);
    const itemsPerPage = 50;
    const searchQuery = ref('');
    const filterMedio = ref('');
    const filterDate = ref('');
    const searchType = ref('all');

    // Opciones de búsqueda
    const searchOptions = [
    { value: 'all', label: 'Todos los campos' },
    { value: 'numeroReserva', label: 'Número de reserva' },
    { value: 'nombreFactura', label: 'Factura' },
    { value: 'nombreProveedor', label: 'Proveedor' },
    { value: 'nombreCliente', label: 'Cliente' },
    { value: 'nombreCampania', label: 'Campaña' },
    { value: 'OP', label: 'OP' }
    ];


    // Petición al servidor para obtener las órdenes de compra con Axios
    const fetchPurchaseOrders = async () => {
        try {
          purchaseOrders.value = await ValidacionService.fetchPurchaseOrders();
        } catch (error) {
          console.error('Error al obtener las órdenes de compra:', error);
        }
    };

    // Ejecutar la función al montar el componente
    onMounted(() => {
      fetchPurchaseOrders();
    });

    // Lógica para filtrar y paginar las órdenes de compra
   const filteredOrders = computed(() => {
      return purchaseOrders.value.filter(order => {
        let matchesSearch;
        if (searchType.value === 'all') {
          matchesSearch = 
            order.numeroReserva.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            order.nombreFactura.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            order.nombreProveedor.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            order.nombreCliente.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            order.nombreCampania.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            order.OP.toString().includes(searchQuery.value);
        } else {
          matchesSearch = order[searchType.value].toString().toLowerCase().includes(searchQuery.value.toLowerCase());
        }

        const matchesMedio = filterMedio.value === '' || order.nombreCliente === filterMedio.value;
        const matchesDate = filterDate.value === '' || 
                            (new Date(order.fechaAprobada).getFullYear() === parseInt(filterDate.value.split('-')[0]) &&
                             (new Date(order.fechaAprobada).getMonth() + 1) === parseInt(filterDate.value.split('-')[1]));
        return matchesSearch && matchesMedio && matchesDate;
      });
    });

    const paginatedOrders = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return filteredOrders.value.slice(start, end);
    });

    const totalPages = computed(() => {
      return Math.ceil(filteredOrders.value.length / itemsPerPage);
    });

    const changePage = (page) => {
      currentPage.value = page;
    };

    const formatCurrency = (value) => {
      return new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' }).format(value);
    };

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-CR', { year: 'numeric', month: 'long', day: 'numeric' });
    };

   
    const searchPurchaseOrder = () => {
      currentPage.value = 1;
    };


    //Mostrar detalles---------------------------------------------------------------------------------------------

    const showOrderDetails = (order) => {
        const app = createApp({
          render() {
            return h(OrdenDeCompraDetalle, {//LLama un componente de vue
              orderDetails: order,
              onEdit: () => {
                // Lógica para editar
                Swal.close();
                // ... tu código para editar
              },
              onAttach: () => {
                // Lógica para adjuntar
                Swal.close();
                // ... tu código para adjuntar
              },
              onSend: () => {
                // Lógica para enviar
                Swal.close();
                // ... tu código para enviar
              }
            });
          }
        });
      
        const div = document.createElement('div');
        app.mount(div);
      
        Swal.fire({
          title: 'Detalles de la orden de compra',
          html: div,
          showConfirmButton: false,
          width: '80%',
          customClass: {
            container: 'order-details-modal'
          },
          showCloseButton: true,
          didDestroy: () => {
            // Dice gpto: Asegúrate de desmontar la aplicación Vue cuando el modal se cierre
            app.unmount();
          }
          
        });
      };
      

   

    return {
      currentPage,
      totalPages,
      paginatedOrders,
      searchQuery,
      filterMedio,
      filterDate,
      changePage,
      formatCurrency,
      formatDate,
      searchPurchaseOrder,
      showOrderDetails,
      searchType,
      searchOptions,
    };
  }
};
