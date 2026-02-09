// ============================================
// Dialog Store - 全局对话框状态管理
// ============================================
import { create } from 'zustand';

interface DialogState {
    newChatDialogOpen: boolean;
    setNewChatDialogOpen: (open: boolean) => void;
    toggleNewChatDialog: () => void;
}

export const useDialogStore = create<DialogState>((set) => ({
    newChatDialogOpen: false,
    setNewChatDialogOpen: (open) => set({ newChatDialogOpen: open }),
    toggleNewChatDialog: () => set((state) => ({ newChatDialogOpen: !state.newChatDialogOpen })),
}));

