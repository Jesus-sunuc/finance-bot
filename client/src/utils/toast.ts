import toast, { Toaster } from "react-hot-toast";

export const showSuccessToast = (message: string) => {
  toast.success(message, {
    duration: 3000,
    position: "top-right",
    style: {
      background: "#10B981",
      color: "#fff",
    },
    iconTheme: {
      primary: "#fff",
      secondary: "#10B981",
    },
  });
};

export const showErrorToast = (message: string) => {
  toast.error(message, {
    duration: 4000,
    position: "top-right",
    style: {
      background: "#EF4444",
      color: "#fff",
    },
    iconTheme: {
      primary: "#fff",
      secondary: "#EF4444",
    },
  });
};

export const showLoadingToast = (message: string) => {
  return toast.loading(message, {
    position: "top-right",
    style: {
      background: "#3B82F6",
      color: "#fff",
    },
  });
};

export const dismissToast = (toastId: string) => {
  toast.dismiss(toastId);
};

export { Toaster };
