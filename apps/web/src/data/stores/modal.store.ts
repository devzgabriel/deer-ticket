import { ModalProps } from "@/presentation/components/internal/modals/modals";
import { createStore } from "lupi";

type Props = {
  modals: ModalProps[];
};

type ActionsProps = {
  openModal: (state: Props, modal: Omit<ModalProps, "isOpen">) => Props;
  closeModal: (state: Props, id: string) => Props;
};

export const useModalStore = createStore<Props, ActionsProps>(
  {
    modals: [],
  },
  {
    actions: {
      openModal: (state, modal) => ({
        modals: [...state.modals, { ...modal, isOpen: true }],
      }),
      closeModal: (state, id) => ({
        modals: state.modals.filter((modal) => modal.id !== id),
      }),
    },
  },
);
