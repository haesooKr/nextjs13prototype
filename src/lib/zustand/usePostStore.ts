import { create } from "zustand";

const usePostStore = create((set) => ({
  savedPost: {},
  updatePost: (post: any) => {
    set({ savedPost: post });
  },
}));

export default usePostStore;
