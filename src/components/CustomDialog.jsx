import React, { useEffect } from 'react'

const Dialog = ({ open, onClose, children }) => {
    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }

        // Cleanup on unmount
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [open])

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && open) {
                onClose()
            }
        }

        if (open) {
            document.addEventListener('keydown', handleEscape)
        }

        return () => {
            document.removeEventListener('keydown', handleEscape)
        }
    }, [open, onClose])

    if (!open) return null

    return (
        <div className="fixed inset-0 z-50">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={onClose}
            />

            {/* Dialog */}
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <div
                    className="relative bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    {children}
                </div>
            </div>
        </div>
    )
}

const DialogHeader = ({ children }) => (
    <div className="px-6 pt-6 pb-4">
        {children}
    </div>
)

const DialogTitle = ({ children, className = '' }) => (
    <h2 className={`text-lg font-semibold text-gray-900 ${className}`}>
        {children}
    </h2>
)

const DialogDescription = ({ children, className = '' }) => (
    <p className={`text-sm text-gray-600 mt-2 ${className}`}>
        {children}
    </p>
)

const DialogContent = ({ children, className = '' }) => (
    <div className={`px-6 ${className}`}>
        {children}
    </div>
)

const DialogFooter = ({ children, className = '' }) => (
    <div className={`px-6 py-4 flex justify-end gap-3 ${className}`}>
        {children}
    </div>
)

export { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogContent, DialogFooter }