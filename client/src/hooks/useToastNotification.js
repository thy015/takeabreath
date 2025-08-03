import { useCallback } from "react";
import { toast } from "sonner";

export function useToastNotifications() {
  const showSuccess = useCallback((message) => {
    toast.success(message);
  }, []);

  const showError = useCallback((message) => {
    toast.error(message);
  }, []);

  const showWarning = useCallback((message) => {
    toast.loading(message);
  }, []);

  return { showSuccess, showError, showWarning };
}
