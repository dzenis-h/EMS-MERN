import Swal from "sweetalert2";

export const swalError = (err: any) => {
  Swal.fire({
    icon: "error",
    text: err,
  });
};

export const swalSuccess = (text: string) => {
  Swal.fire({
    icon: "success",
    text,
  });
};

export const swalConfirm = (message: string) => {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });
  return swalWithBootstrapButtons.fire({
    title: "Are you sure?",
    text: message,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Confirm",
    cancelButtonText: "Cancel",
    reverseButtons: true,
  });
};
