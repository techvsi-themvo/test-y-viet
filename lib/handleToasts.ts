import { toast, ToastContainerProps } from 'react-toastify';

export const configToast: ToastContainerProps = {
  position: 'top-right',
  autoClose: 2000,
  hideProgressBar: false,
  newestOnTop: false,
  closeOnClick: false,
  rtl: false,
  pauseOnFocusLoss: true,
  draggable: true,
  pauseOnHover: true,
  theme: 'light',
};

export const handleShowToast = (message: string, type: 'success' | 'error') => {
  if (type === 'success') {
    toast.success(message, {
      position: 'top-right',
    });
  }
  if (type === 'error') {
    toast.error(message, {
      position: 'top-right',
    });
  }
};
