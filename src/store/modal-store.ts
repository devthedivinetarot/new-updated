import { create } from 'zustand';

interface ModalState {
  isReadingModalOpen: boolean;
  readingModalData: {
    question: string;
    category: string;
  } | null;
  isPaywallModalOpen: boolean;
  isAddictionLockOpen: boolean;
  
  openReadingModal: (data: { question: string; category: string }) => void;
  closeReadingModal: () => void;
  openPaywallModal: () => void;
  closePaywallModal: () => void;
  openAddictionLock: () => void;
  closeAddictionLock: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isReadingModalOpen: false,
  readingModalData: null,
  isPaywallModalOpen: false,
  isAddictionLockOpen: false,
  
  openReadingModal: (data) => set({ 
    isReadingModalOpen: true, 
    readingModalData: data 
  }),
  closeReadingModal: () => set({ 
    isReadingModalOpen: false, 
    readingModalData: null 
  }),
  openPaywallModal: () => set({ isPaywallModalOpen: true }),
  closePaywallModal: () => set({ isPaywallModalOpen: false }),
  openAddictionLock: () => set({ isAddictionLockOpen: true }),
  closeAddictionLock: () => set({ isAddictionLockOpen: false }),
}));