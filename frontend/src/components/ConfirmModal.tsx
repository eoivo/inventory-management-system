import { AlertTriangle, Loader2 } from 'lucide-react';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    loading?: boolean;
}

export function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    loading = false
}: ConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal max-w-md" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-full bg-[hsl(var(--color-error-light))] text-[hsl(var(--color-error))]">
                            <AlertTriangle className="w-5 h-5" />
                        </div>
                        <h3 className="modal-title">{title}</h3>
                    </div>
                    <button className="btn btn-ghost btn-sm" onClick={onClose}>
                        &times;
                    </button>
                </div>

                <div className="modal-body py-6">
                    <p className="text-[hsl(var(--color-text-secondary))] leading-relaxed">
                        {message}
                    </p>
                </div>

                <div className="modal-footer bg-[hsl(var(--color-surface))]">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={onClose}
                        disabled={loading}
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        className="btn btn-danger"
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
