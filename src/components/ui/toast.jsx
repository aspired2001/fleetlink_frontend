import * as React from "react"
import { X } from "lucide-react"
import { cn } from "../../lib/utils"

const ToastContext = React.createContext()

export function ToastProvider({ children }) {
    const [toasts, setToasts] = React.useState([])

    const addToast = React.useCallback((toast) => {
        const id = Math.random().toString(36).substr(2, 9)
        const newToast = { ...toast, id }
        setToasts((prev) => [...prev, newToast])

        // Auto dismiss after 5 seconds
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id))
        }, 5000)
    }, [])

    const removeToast = React.useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
    }, [])

    return (
        <ToastContext.Provider value={{ addToast, removeToast }}>
            {children}
            <div className="fixed top-0 right-0 z-50 p-4 space-y-2">
                {toasts.map((toast) => (
                    <Toast key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
                ))}
            </div>
        </ToastContext.Provider>
    )
}

export function useToast() {
    const context = React.useContext(ToastContext)
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider")
    }
    return context
}

function Toast({ toast, onRemove }) {
    const variantClasses = {
        default: "bg-background text-foreground border",
        success: "bg-green-100 text-green-900 border-green-200",
        error: "bg-red-100 text-red-900 border-red-200",
        warning: "bg-yellow-100 text-yellow-900 border-yellow-200"
    }

    return (
        <div
            className={cn(
                "flex items-center justify-between p-4 rounded-md shadow-md min-w-80 max-w-md",
                variantClasses[toast.variant || 'default']
            )}
        >
            <div>
                {toast.title && <div className="font-semibold">{toast.title}</div>}
                {toast.description && <div className="text-sm">{toast.description}</div>}
            </div>
            <button
                onClick={onRemove}
                className="ml-4 p-1 hover:bg-black/10 rounded"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    )
}