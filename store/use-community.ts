import { Community } from "@prisma/client";
import { create } from "zustand";

type Store = {
  community: Community;
  setCommunity: (state: Community) => void;
  setClear: () => void;
};

export const useCommunity = create<Store>()((set) => ({
  community: {} as Community,
  setCommunity: (community: Community) => set(() => ({ community })),
  setClear: () => set(() => ({ community: undefined })),
}));
