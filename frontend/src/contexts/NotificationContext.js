// ============================================
// frontend/src/contexts/NotificationContext.js
// ============================================
import React, { createContext, useContext, useState } from 'react';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const addNotification = (message, type = 'info') => {
        const id = Date.now();
        const notification = { id, message, type };

        setNotifications((prev) => [...prev, notification]);

        // Auto remove after 5 seconds
        setTimeout(() => {
            removeNotification(id);
        }, 5000);
    };

    const removeNotification = (id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    const success = (message) => addNotification(message, 'success');
    const error = (message) => addNotification(message, 'error');
    const warning = (message) => addNotification(message, 'warning');
    const info = (message) => addNotification(message, 'info');

    const value = {
        notifications,
        addNotification,
        removeNotification,
        success,
        error,
        warning,
        info,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
            {/* Notification Display */}
            <div className="fixed top-4 right-4 z-50 space-y-2">
                {notifications.map((notif) => (
                    <div
                        key={notif.id}
                        className={`px-6 py-4 rounded-lg shadow-lg backdrop-blur-xl border animate-slide-down ${
                            notif.type === 'success'
                                ? 'bg-green-900/80 border-green-500/50'
                                : notif.type === 'error'
                                ? 'bg-red-900/80 border-red-500/50'
                                : notif.type === 'warning'
                                ? 'bg-yellow-900/80 border-yellow-500/50'
                                : 'bg-blue-900/80 border-blue-500/50'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <p className="text-white">{notif.message}</p>
                            <button
                                onClick={() => removeNotification(notif.id)}
                                className="ml-4 text-white/70 hover:text-white"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error(
            'useNotification must be used within NotificationProvider'
        );
    }
    return context;
};
