<template>
  <div class="order-details pb-3">
    <!-- Detalles de la orden de compra o de la factura, dependiendo de showAttach -->
    <div v-if="!showAttach" class="table-responsive" style="max-height: 400px;">
      <table class="table table-striped table-bordered">
        <tbody>
          <tr v-for="(value, key) in filteredOrderDetails" :key="key">
            <th scope="row" class="w-50">{{ formatLabel(key) }}</th>
            <td>{{ formatValue(key, value) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="row">
      <div class="col-md-6">
        <h4>Detalles de la Orden</h4>
        <div class="table-responsive" style="max-height: 400px;">
          <table class="table table-striped table-bordered">
            <tbody>
              <tr v-for="(value, key) in filteredOrderDetails" :key="key">
                <th scope="row" class="w-50">{{ formatLabel(key) }}</th>
                <td>{{ formatValue(key, value) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="col-md-6">
        <h4>Detalles de la Factura</h4>
        <div class="table-responsive" style="max-height: 400px;">
          <table class="table table-striped table-bordered">
            <tbody>
              <tr v-for="(value, key) in editableInvoice" :key="key">
                <th scope="row" class="w-50">{{ formatLabel(key) }}</th>
                <td>
                  <!-- Si es Orden_Asociada o FacturaID, mostrar solo el valor (no editable) -->
                  <span v-if="key === 'Orden_Asociada' || key === 'facturaID'">{{ formatValue(key, value) }}</span>

                  <!-- Para otros campos, permitir edición, incluido Total -->
                  <input
                    v-else
                    type="text"
                    class="form-control"
                    :class="{'is-invalid': errors[key]}"
                    v-model="editableInvoice[key]"
                  >
                  <!-- Mensaje de error debajo del campo si hay errores -->
                  <small v-if="errorMessages[key]" class="text-danger">{{ errorMessages[key] }}</small>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="d-flex justify-content-between mt-3">
          <button @click="populateInvoice" class="btn btn-success">Llenado automático</button>
          <button @click="saveInvoice" class="btn btn-primary">Guardar Factura</button>
        </div>
      </div>
    </div>

    <!-- Botones justo debajo del componente -->
    <div class="d-grid gap-3 d-md-flex justify-content-md-center mt-4 pt-3 border-top">
      <button class="btn btn-primary btn-lg px-4" @click="$emit('edit')">Editar</button>
      <button class="btn btn-secondary btn-lg px-4" @click="toggleAttach">
        {{ showAttach ? 'Cerrar' : 'Adjuntar' }}
      </button>
      <button class="btn btn-success btn-lg px-4" @click="sendPurchase">Enviar</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';
import ValidacionService from './ValidacionService';


export default {
  props: {
    orderDetails: Object
  },
  data() {
    return {
      showAttach: false,
      editableInvoice: {
        Orden_Asociada: this.orderDetails.OP,
        Cedula_Juridica: '',
        fecha_Creacion: '',
        fecha_Aprobacion: '',
        fecha_Emision: '',
        Nombre_Proveedor: '',
        Nombre_Cliente: '',
        Nombre_Factura: '',
        Nombre_Campaña: '',
        Costo_Pauta: '',
        Descuento: '',
        TCP: '',
        IVA: '',
        Total: '',
        Numero_Reserva: '',
        Comision: '',
        Utilidad: '',
        Otros: 0
      },
      orderData: {},
      errors: {}, // Mapea los errores a los campos
      errorMessages: {} // Mapea los mensajes de error
    };
  },
  computed: {
    filteredOrderDetails() {
      return Object.keys(this.orderData).reduce((acc, key) => {
        if (key !== 'created_at' && key !== 'updated_at') {
          acc[key] = this.orderData[key];
        }
        return acc;
      }, {});
    }
  },
  mounted() {
    this.fetchOrderDetails();
  },
  methods: {
    async fetchOrderDetails() {
      try {
        const response = await axios.get('/ordenpedido/OP', { params: { OP: this.orderDetails.OP } });
        this.orderData = response.data;
      } catch (error) {
        console.error('Error fetching order details:', error);
      }
    },
    formatLabel(key) {
      return key.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
    },
    formatValue(key, value) {
      if (key === 'total') return this.formatCurrency(value);
      if (key.toLowerCase().includes('fecha')) return this.formatDate(value);
      return value;
    },
    formatCurrency(value) {
      return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);
    },
    formatDate(value) {
      const date = new Date(value);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    validateCedulaJuridica(cedula) {
      const cedulaRegex = /^\d-\d{3}-\d{6}$/;
      if (!cedulaRegex.test(cedula)) {
        this.errors.Cedula_Juridica = true;
        this.errorMessages.Cedula_Juridica = 'Cédula jurídica inválida. El formato correcto es X-XXX-XXXXXX';
        return false;
      }
      this.errors.Cedula_Juridica = false;
      this.errorMessages.Cedula_Juridica = '';
      return true;
    },
    validateTextFields() {
      const textFields = ['Nombre_Proveedor', 'Nombre_Cliente', 'Nombre_Factura', 'Nombre_Campaña'];
      const textRegex = /^[a-zA-Z0-9\s\-_.]+$/;
      let valid = true;

      textFields.forEach(field => {
        if (!textRegex.test(this.editableInvoice[field])) {
          this.errors[field] = true;
          this.errorMessages[field] = 'Este campo solo debe contener letras, números, espacios, guiones, guiones bajos, comas y puntos.';
          valid = false;
        } else {
          this.errors[field] = false;
          this.errorMessages[field] = '';
        }
      });
      return valid;
    },
    validateDate(date, field) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(date)) {
        this.errors[field] = true;
        this.errorMessages[field] = 'Formato de fecha inválido. El formato correcto es yyyy-mm-dd';
        return false;
      }
      this.errors[field] = false;
      this.errorMessages[field] = '';
      return true;
    },
    validateNumericFields() {
      const numericFields = ['Costo_Pauta', 'Descuento', 'TCP', 'IVA', 'Total', 'Comision', 'Utilidad', 'Otros'];
      const numberRegex = /^\d+(\.\d{1,2})?$/;
      let valid = true;

      numericFields.forEach(field => {
        if (!numberRegex.test(this.editableInvoice[field])) {
          this.errors[field] = true;
          this.errorMessages[field] = 'Debe ser un número válido.';
          valid = false;
        } else {
          this.errors[field] = false;
          this.errorMessages[field] = '';
        }
      });
      return valid;
    },
       validateNumericFieldsWithGuion() {
      const numericFields = ['Numero_Reserva'];
      const numberRegex = /^(No|[-\d\sA-Za-z]+)$/; // Modificado para aceptar números, guiones, espacios y la palabra "No"
      let valid = true;
    
      numericFields.forEach(field => {
        if (!numberRegex.test(this.editableInvoice[field])) {
          this.errors[field] = true;
          this.errorMessages[field] = 'Debe ser un número válido. (Espacios, guiones y la palabra "No" permitidos)';
          valid = false;
        } else {
          this.errors[field] = false;
          this.errorMessages[field] = '';
        }
      });
    
      return valid;
    },
    validateMatchingFields() {
      const fieldsToCheck = ['fecha_Creacion', 'fecha_Aprobacion', 'Nombre_Proveedor', 'Nombre_Cliente', 'Nombre_Factura', 'Nombre_Campaña'];
      let valid = true;

      fieldsToCheck.forEach(field => {
        if (this.editableInvoice[field] !== this.orderData[field]) {
          this.errors[field] = true;
          this.errorMessages[field] = `El campo ${this.formatLabel(field)} no coincide con los datos de la orden.`;
          valid = false;
        } else {
          this.errors[field] = false;
          this.errorMessages[field] = '';
        }
      });

      return valid;
    },
    validateAllFields() {
      const validations = [
        this.validateCedulaJuridica(this.editableInvoice.Cedula_Juridica),
        this.validateDate(this.editableInvoice.fecha_Creacion, 'fecha_Creacion'),
        this.validateDate(this.editableInvoice.fecha_Aprobacion, 'fecha_Aprobacion'),
        this.validateDate(this.editableInvoice.fecha_Emision, 'fecha_Emision'),
        this.validateTextFields(),
        this.validateNumericFields(),
        this.validateNumericFieldsWithGuion(),
      ];

      return validations.every(validation => validation);
    },
    toggleAttach() {
      this.showAttach = !this.showAttach;
    },
    async saveInvoice() {
      if (!this.validateAllFields()) {
        return; // Salir si hay errores
      }

      try {
        const idFactura = await ValidacionService.postPurchaseOrders(this.editableInvoice);
        this.editableInvoice.facturaID = idFactura;
        this.$emit('save-invoice', this.editableInvoice);

        alert('Factura guardada exitosamente');

      } catch (error) {
        console.error('Error al guardar la factura:', error);
        alert('Ocurrió un error al guardar la factura. Por favor, inténtalo de nuevo.');
      }
    },
    async sendPurchase() {
      try {
        const response = await ValidacionService.sendPurchaseOrder(this.editableInvoice.facturaID);
        console.log(response);

        //agregame suweet alert
        Swal.fire({
          title: 'Orden de compra enviada',
          text: 'La orden de compra se ha enviado correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        }); 
      } catch (error) {
        console.error('Error sending purchase order:', error);
        alert('Ocurrió un error al enviar la orden de compra'); 
        Swal.fire({
          title: 'Error al enviar la orden de compra',
          text: 'Ocurrió un error al enviar la orden de compra',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        }); 
      }
    },
    // Método para llenar los campos de la factura con los datos de la orden
    populateInvoice() {
      console.log('Populating invoice with order data...');
      console.log('Order data:', this.orderData);
      
      const fieldsMapping = {
        'Cedula_Juridica': 'cedula_juridica',
        'fecha_Creacion': 'fecha_creacion',
        'fecha_Aprobacion': 'fecha_aprobacion',
        'Nombre_Proveedor': 'nombre_proveedor',
        'Nombre_Cliente': 'nombre_cliente',
        'Nombre_Factura': 'nombre_factura',
        'Nombre_Campaña': 'nombre_campania',
        'Costo_Pauta': 'costo_pauta',
        'Descuento': 'descuento',
        'TCP': 'tcp_1%',
        'IVA': 'iva_13%',
        'Total': 'total',
        'Numero_Reserva': 'numero_reserva',
        'Comision': 'comision',
        'Utilidad': 'utilidad',
        'Otros': 'otros'
      };
      

      Object.entries(fieldsMapping).forEach(([invoiceField, orderField]) => {
        if (this.orderData[orderField] !== undefined) {
          this.editableInvoice[invoiceField] = this.orderData[orderField];
        }
      });

      // Set fecha_Emision to today's date
      const today = new Date();
      this.editableInvoice.fecha_Emision = today.toISOString().split('T')[0];

      // Clear any existing errors
      this.errors = {};
      this.errorMessages = {};

      console.log('Populated invoice:', this.editableInvoice);
    },
  }

  

};
</script>