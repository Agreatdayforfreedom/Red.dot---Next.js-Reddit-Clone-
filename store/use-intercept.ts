import { create } from "zustand";

type Store = {
  intercepted: boolean;
  intercept: (state: boolean) => void;
};

export const useIntercept = create<Store>()((set) => ({
  intercepted: false,
  intercept: (intercepted: boolean) => set(() => ({ intercepted })),
}));
