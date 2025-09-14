import React, { useEffect } from 'react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 dark:bg-opacity-70 z-50 flex justify-center items-center p-4" 
            role="dialog" 
            aria-modal="true" 
            aria-labelledby="confirmation-modal-title"
            onClick={handleBackdropClick}
        >
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 w-full max-w-md transition-colors duration-300" onClick={e => e.stopPropagation()}>
                <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700">
                    <h2 id="confirmation-modal-title" className="text-xl font-bold text-slate-900 dark:text-white">{title}</h2>
                </div>
                <div className="p-4 sm:p-6">
                    <p className="text-slate-600 dark:text-slate-300">{message}</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 flex justify-end space-x-3 rounded-b-lg">
                    <button 
                        type="button" 
                        onClick={onClose} 
                        className="bg-white dark:bg-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-white font-semibold py-2 px-4 rounded-lg border border-slate-300 dark:border-slate-500 transition-colors duration-200"
                    >
                        Cancel
                    </button>
                    <button 
                        type="button" 
                        onClick={onConfirm} 
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
