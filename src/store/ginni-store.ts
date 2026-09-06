'use client';

import { create } from 'zustand';
import { GinniContext } from '@/components/GinniChat';

interface GinniState {
  context: GinniContext | undefined;
  triggerOpen: boolean;
  isOpen: boolean;
  setContext: (context: GinniContext | undefined) => void;
  setTriggerOpen: (trigger: boolean) => void;
  setIsOpen: (open: boolean) => void;
  clearContext: () => void;
}

export const useGinniStore = create<GinniState>((set) => ({
  context: undefined,
  triggerOpen: false,
  isOpen: false,
  
  setContext: (context) => set({ context }),
  
  setTriggerOpen: (triggerOpen) => set({ triggerOpen }),
  
  setIsOpen: (isOpen) => set({ isOpen }),
  
  clearContext: () => set({ context: undefined, triggerOpen: false })
}));