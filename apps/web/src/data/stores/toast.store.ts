import { ToasterToast } from "@/presentation/components/internal/toasts/toast-provider";
import { createStore } from "lupi";

const TOAST_LIMIT = 3;
export const TOAST_REMOVE_DELAY_IN_MILLISECONDS = 3000;

export type ToastType = Omit<ToasterToast, "id">;

type Props = {
  toasts: ToasterToast[];
  count: number;
};

type ActionsProps = {
  openToast: (state: Props, toast: ToastType) => Props;
  closeToast: (state: Props, id: string) => Props;
};

export const useToastStore = createStore<Props, ActionsProps>(
  {
    toasts: [],
    count: 0,
  },
  {
    actions: {
      openToast: (state, toast) => {
        const removeId = genId(state.count - TOAST_LIMIT);
        const newId = genId(state.count);
        const newToasts =
          state.count - TOAST_LIMIT < 0
            ? state.toasts
            : state.toasts.filter((toast) => toast.id !== removeId);
        const newToast: ToasterToast = { ...toast, id: newId };

        return {
          toasts: [...newToasts, newToast],
          count: state.count + 1,
        };
      },
      closeToast: (state, id) => {
        return {
          ...state,
          toasts: state.toasts.filter((toast) => toast.id !== id),
        };
      },
    },
  },
);

function genId(index: number) {
  return (index % Number.MAX_SAFE_INTEGER).toString();
}
