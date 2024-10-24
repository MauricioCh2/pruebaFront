<template>
   <div class="d-flex justify-content-end align-items-center mb-4 mt-3 mx-4">
    <!-- Filtros y búsqueda -->
    <div class="d-flex align-items-center">
      <div class="me-2">
        <input 
          type="month" 
          v-model="filterDate" 
          class="form-control"
        />
      </div>

      <div class="me-2">
        <select v-model="searchType" class="form-select">
          <option v-for="option in searchOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>

      <div class="input-group" style="width: 350px;">
        <input 
          type="text" 
          class="form-control" 
          :placeholder="'Buscar por ' + searchOptions.find(opt => opt.value === searchType).label.toLowerCase() + '...'" 
          v-model="searchQuery"
          @input="searchPurchaseOrder"
        />
        <div class="input-group-append">
          <span class="input-group-text">
            <i class="bi bi-search"></i>
          </span>
        </div>
      </div>
    </div>
  </div>

  <div class="mx-4">
    <h2>Lista de Órdenes de Compra</h2>
    <div class="mx-5" style="max-height: 700px; overflow-y: auto;">
      <table class="table table-striped">
        <thead class="table-dark">
          <tr>
            <th>OP</th>
            <th>Numero de reserva</th>
            <th>Nombre factura</th>
            <th>Proveedor</th>
            <th>Cliente</th>
            <th>Campaña</th>
            <th>Fecha aprobada</th>
            <th>Total</th>
            <th>Detalles</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="order in paginatedOrders" :key="order.OP">
            <td>{{ order.OP }}</td>
            <td>{{ order.numeroReserva }}</td>
            <td>{{ order.nombreFactura }}</td>
            <td>{{ order.nombreProveedor }}</td>
            <td>{{ order.nombreCliente }}</td>
            <td>{{ order.nombreCampania }}</td> <!-- Asegúrate de que esto exista en los datos -->
            <td>{{ order.fechaAprobada }}</td>
            <td>{{ formatCurrency(order.total) }}</td>
            <td>
              <button 
                @click="showOrderDetails(order)" 
                class="btn btn-info"
              >
                <i class="bi bi-info-circle"></i>
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




  <!-- Modal for Purchase Order Details -->
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl">
      <PurchaseOrderDetail
        :order="selectedOrder"
        @edit="handleEdit"
        @attach="handleAttach"
        @send="handleSend"
      />
      <button @click="closeModal" class="mt-4 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">
        Cerrar
      </button>
    </div>
  </div>

</template>


<script src="./ValidacionDashboard_log.js"> </script>


<style scoped>
.input-group-append .input-group-text {
  cursor: pointer;
}
</style>