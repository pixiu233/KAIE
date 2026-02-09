// ============================================
// NewChatButton - 新建对话按钮组件
// ============================================
import { Plus } from 'lucide-react';
import { useDialogStore } from '../stores/dialogStore';

interface NewChatButtonProps {
    collapsed?: boolean;
    colors: {
        hoverSecondary: string;
        textMuted: string;
        border: string;
    };
}

export function NewChatButton({ collapsed = false, colors }: NewChatButtonProps) {
    const { setNewChatDialogOpen } = useDialogStore();

    return (
        <button
            onClick={() => setNewChatDialogOpen(true)}
            className={`
                w-full flex items-center gap-3 px-3 py-3 rounded-lg border transition-colors
                ${collapsed ? 'justify-center' : ''}
                ${colors.hoverSecondary} border-slate-300 dark:border-slate-600
            `}
        >
            <Plus size={18} />
            {!collapsed && <span className="text-sm font-medium">New Chat</span>}
        </button>
    );
}
