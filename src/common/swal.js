import Swal from 'sweetalert2';

export function Success(message) {
  Swal.fire({
    position: 'top-end',
    icon: 'success',
    title: message ? message : 'Success! Your action has been completed.',
    showCloseButton: true,
    showConfirmButton: false,
    timer: 2000,
    toast: true,
    background: 'green',
    color: "white",
    customClass: {
      container: 'swal_container_zindex',
    },
  })
}

export function Error(message) {
  Swal.fire({
    position: 'top-end',
    icon: 'error',
    title: message ? message : 'Something went wrong.',
    showCloseButton: true,
    showConfirmButton: false,
    timer: 5000,
    toast: true,
    background: '#E23F33',
    color: "white",
    iconColor: "#E29F99",
    customClass: {
      container: 'swal_container_zindex',
    },
  })
}



export function showSwalDialog(title, text, confirmButtonText, cancelButtonText){
  return Swal.fire({
    title: title || 'Are you sure?',
    text: text || '',
    showCancelButton: true,
    confirmButtonText: confirmButtonText || 'Confirm',
    cancelButtonText: cancelButtonText || 'Cancel',
    customClass: {
      popup: 'swal2-popup',           
      title: 'swal2-title',           
      image: 'swal2-image',           
      content: 'swal2-content',       
      actions: 'swal2-actions',       
      confirmButton: 'swal2-confirm', 
      cancelButton: 'swal2-cancel',   
      denyButton: 'swal2-deny',       
    }
  });
};

