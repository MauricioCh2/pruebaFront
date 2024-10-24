// PopUps.js
import Swal from 'sweetalert2';

class PopUps {
  static async showBasicPopup(content, title = 'Información') {
    return Swal.fire({
      title: title,
      html: content,
      icon: 'info',
      confirmButtonText: 'Aceptar'
    });
  }

  static async showConfirmationPopup(message, title, confirmText = 'Sí', cancelText = 'No') {
    return Swal.fire({
      title: title,
      text: message,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText
    });
  }

  static async showTimedPopup(content, title = 'Información', duration = 3000) {
    return Swal.fire({
      title: title,
      html: content,
      icon: 'info',
      timer: duration,
      timerProgressBar: true,
      showConfirmButton: false
    });
  }
}

export default PopUps;