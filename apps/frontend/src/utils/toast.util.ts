import { toast } from "sonner";

export const toastUtil = {
  /**
   * Show a success toast notification
   */
  success: (message: string, description?: string) => {
    toast.success(message, {
      description,
      duration: 4000,
    });
  },

  /**
   * Show an error toast notification
   */
  error: (message: string, description?: string) => {
    toast.error(message, {
      description,
      duration: 6000,
    });
  },

  /**
   * Show an info toast notification
   */
  info: (message: string, description?: string) => {
    toast.info(message, {
      description,
      duration: 4000,
    });
  },

  /**
   * Show a warning toast notification
   */
  warning: (message: string, description?: string) => {
    toast.warning(message, {
      description,
      duration: 5000,
    });
  },

  /**
   * Show a loading toast notification
   */
  loading: (message: string) => {
    return toast.loading(message);
  },

  /**
   * Dismiss a specific toast
   */
  dismiss: (toastId: string | number) => {
    toast.dismiss(toastId);
  },
};
