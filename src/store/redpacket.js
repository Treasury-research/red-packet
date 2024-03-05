import { immer } from 'zustand/middleware/immer'
import { persist } from 'zustand/middleware'
import { create } from 'zustand'

const createRedPacketSlice = immer((set, get) => ({
  redPacketInfo: {},
  setRedPacketInfo: (value) => set({ redPacketInfo: value || {} }),
  updateRedPacketInfo: (value) => set({
    redPacketInfo: {
      ...get().redPacketInfo,
      ...value
    }
  }),
  clearRedPacketStore: () => set({
    redPacketInfo: {},
  }),
  getRedPacketInfo: () => get().redPacketInfo,
}));

export const createRedPacketStore = (initProps) =>
  create()((...a) => ({ ...createRedPacketSlice(...a), ...initProps }));

export const useRedPacketStore = create()(
  persist((...set) => ({ ...createRedPacketSlice(...set) }), {
    name: 'redPacket-storage',
  }),
);
