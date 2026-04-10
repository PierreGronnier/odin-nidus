import useToastStore from "../../store/toastStore";
import { X, CircleCheck, CircleAlert } from "lucide-react";
import "../../styles/Toast.css";

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast--${toast.type}`}>
          {toast.type === "success" ? (
            <CircleCheck size={16} />
          ) : (
            <CircleAlert size={16} />
          )}
          <span>{toast.message}</span>
          <button onClick={() => removeToast(toast.id)}>
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
