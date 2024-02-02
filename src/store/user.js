import { immer } from 'zustand/middleware/immer'
import { persist } from 'zustand/middleware'
import { create } from 'zustand'

const createUserSlice = immer((set, get) => ({
  userInfo: {},
  setUserInfo: (value) => set({ userInfo: value || {} }),
  updateUserInfo: (value) => set({
    userInfo: {
      ...get().userInfo,
      ...value
    }
  }),
  clearUserStore: () => set({
    userInfo: {},
  }),
  getUserInfo: () => get().userInfo,
}));

export const createUserStore = (initProps) =>
  create()((...a) => ({ ...createUserSlice(...a), ...initProps }));

export const useUserStore = create()(
  persist((...set) => ({ ...createUserSlice(...set) }), {
    name: 'user-storage',
  }),
);
