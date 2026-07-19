import { create } from 'zustand'

/**
 * 集中式状态（类比 Vuex：单一 store、可预测的 actions）
 * Zustand：轻量、无 Provider 包裹也可使用，适合中小型应用。
 */
export const useAppStore = create((set) => ({
  count: 0,
  user: { name: '访客', role: 'guest' },

  increment: (step = 1) => set((s) => ({ count: s.count + step })),
  decrement: (step = 1) => set((s) => ({ count: s.count - step })),
  resetCount: () => set({ count: 0 }),

  login: (name) =>
    set({
      user: { name, role: 'user' },
    }),
  logout: () =>
    set({
      user: { name: '访客', role: 'guest' },
    }),
}))
