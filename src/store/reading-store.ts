import { create } from 'zustand';

interface ReadingState {
  question: string;
  category: string;
  setQuestion: (question: string) => void;
  setCategory: (category: string) => void;
}

export const useReadingStore = create<ReadingState>((set) => ({
  question: '',
  category: '',
  setQuestion: (question) => set({ question }),
  setCategory: (category) => set({ category }),
}));