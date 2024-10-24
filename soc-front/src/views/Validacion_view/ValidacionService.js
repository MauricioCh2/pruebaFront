import axios from 'axios';
import ColorsService from '@/services/Colors';//IOmporta la liubreria de colores 


export default {  
    async fetchPurchaseOrders() {
        const response = await axios.get('/ordenes_pedido'); // Cambia la URL a la ruta correcta
        ColorsService.log('cyan', `Data del back: ${response.data}`);
        console.log(response.data)
        //Mapeo de ordenes de compra
        return response.data.map(order => ({
            OP: order.op,
            numeroReserva : order.numero_reserva,
            nombreFactura: order.nombre_factura,
            nombreProveedor: order.nombre_proveedor,
            nombreCliente: order.nombre_cliente,
            nombreCampania: order.nombre_campania,
            fechaCreacion: order.fecha_creacion,
            fechaAprobada: order.fecha_aprobacion,
            total: order.total,
            
        }));
       
    },
    validateString(value) {
        return typeof value === 'string' && value.trim() !== '' ? value : null;
    },
    validateNumber(value) {
        const number = Number(value);
        return !isNaN(number) ? number : 0;  // Devuelve 0 si el valor no es un número válido
    },
    validateDate(value) {
        const date = new Date(value);
        return !isNaN(date.getTime()) ? value : null;  // Devuelve null si no es una fecha válida
    },
    async postPurchaseOrders(editable){
        // Crear el payload con validación y conversión de tipos
        console.log(editable);
        const payload = {
            fecha_creacion: this.validateDate(editable.fecha_Creacion),  // Validar que sea una fecha válida
            fecha_aprobacion: this.validateDate(editable.fecha_Aprobacion),  // Validar que sea una fecha válida
            fecha_factura: this.validateDate(editable.fecha_Emision),  // Validar que sea una fecha válida
            cedula_juridica_proveedor: this.validateString(editable.Cedula_Juridica),  // Asegurarse de que sea un string no vacío
            nombre_proveedor: this.validateString(editable.Nombre_Proveedor),  // Validar que no esté vacío
            nombre_cliente: this.validateString(editable.Nombre_Cliente),  // Validar que no esté vacío
            nombre_factura: this.validateString(editable.Nombre_Factura),  // Validar que no esté vacío
            nombre_campania: this.validateString(editable.Nombre_Campaña),  // Validar que no esté vacío
            costo_pauta: this.validateNumber(editable.Costo_Pauta),  // Convertir a número si es posible
            descuento: this.validateNumber(editable.Descuento),  // Convertir a número si es posible
            tcp: this.validateNumber(editable.TCP),  // Convertir a número si es posible
            iva: this.validateNumber(editable.IVA),  // Convertir a número si es posible
            total: this.validateNumber(editable.Total),  // Convertir a número si es posible
            numero_reserva: this.validateString(editable.Numero_Reserva),  // Validar que sea un string no vacío
            comision: this.validateNumber(editable.Comision),  // Convertir a número si es posible
            utilidad: this.validateNumber(editable.Utilidad),  // Convertir a número si es posible
            otros: this.validateNumber(editable.Otros),  // Convertir a número si es posible
            orden_asociada: this.validateNumber(editable.Orden_Asociada)  // Convertir a número entero
        };
        console.log(payload);
        try {
            // Enviar el payload al servidor con una petición POST
            const response = await axios.post('/AdjuntarFactura', payload);
            const data = response.data.data;
            console.log(data.id_factura);
            return data.id_factura;  // Devuelve el ID de la factura
        } catch (error) {
            if (error.response) {
                console.error('Error al enviar la factura:', error.response.data);  // Error específico del servidor
            } else {
                console.error('Error al enviar la factura:', error);  // Otro tipo de error (e.g., red)
            }
        }
    },
    async sendPurchaseOrder(idFactura){
        const dataValidate = { id_factura: Number(idFactura) }; // Asegurarse de que sea un entero
        console.log(dataValidate);
        try{
            const response = await axios.put('/ValidarFactura', dataValidate);
            console.log(response)
            return response;
        }catch(error){
            if (error.response) {
                console.error('Error al enviar la factura:', error.response.data);  // Muestra el error específico del servidor
            } else {
                console.error('Error al enviar la factura:', error);
            }
        }
    }
};





  