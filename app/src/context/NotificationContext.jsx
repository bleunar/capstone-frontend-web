import { createContext, useContext, useCallback, useEffect } from "react";
import { toast, ToastContainer } from 'react-toastify';
import { useAuth } from "./AuthContext";
import useAudio from "../hooks/useAudio.jsx";

const positionMap = {
    'top-0 start-50 translate-middle-x': 'top-center',
    'top-0 start-0': 'top-left',
    'top-0 end-0': 'top-right',
    'bottom-0 start-50 translate-middle-x': 'bottom-center',
    'bottom-0 start-0': 'bottom-left',
    'bottom-0 end-0': 'bottom-right'
};

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export function NotificationProvider({ children }) {
    const { settings } = useAuth()
    const { play } = useAudio()

    // called when sending notification to confirm actions
    const notifyConfirm = useCallback((text, description = "") => {
        const position = settings?.notification_position || 'top-right';
        const duration = (settings?.notification_duration || 3) * 1000;
    
        toast.success(text, {
            position: positionMap[position] || 'top-center',
            autoClose: duration,
            className: 'toast-success',
            progressClassName: 'toast-progress-success',
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });

        // play success sound
        play("success");
    }, [play, settings]);


    // called when sending notification to inform users of errors
    const notifyError = useCallback((text, description = "") => {
        const position = settings?.notification_position || 'top-right';
        const duration = (settings?.notification_duration || 3) * 1000;

        toast.error(text, {
            position: positionMap[position] || 'top-center',
            autoClose: duration,
            className: 'toast-error',
            progressClassName: 'toast-progress-error',
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });

        // play error sound
        play("error");
    }, [play, settings]);


    // called when sending notification to inform users
    const notifyInform = useCallback((text, description = "") => {
        const position = settings?.notification_position || 'top-right';
        const duration = (settings?.notification_duration || 3) * 1000;

        toast.info(text, {
            position: positionMap[position] || 'top-center',
            autoClose: duration,
            className: 'toast-info',
            progressClassName: 'toast-progress-info',
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });

        // play inform sound
        play("inform");
    }, [play, settings]);


    // additional notification methods for different use cases
    const notifyWarning = useCallback((text, description = "") => {
        const position = settings?.notification_position || 'top-right';
        const duration = (settings?.notification_duration || 3) * 1000;

        toast.warning(text, {
            position: positionMap[position] || 'top-center',
            autoClose: duration,
            className: 'toast-warning',
            progressClassName: 'toast-progress-warning',
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });

        play("inform");
    }, [play, settings]);

    const notifyLoading = useCallback((text, promise) => {
        return toast.promise(promise, {
            pending: {
                render() {
                    return (
                        <div className="d-flex align-items-center">
                            <div className="spinner-border spinner-border-sm text-primary me-2" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <div>{text}</div>
                        </div>
                    );
                }
            },
            success: {
                render({ data }) {
                    return (
                        <div className="d-flex align-items-center">
                            <i className="bi bi-check-circle-fill text-success me-2 fs-5"></i>
                            <div>Operation completed successfully</div>
                        </div>
                    );
                }
            },
            error: {
                render({ data }) {
                    return (
                        <div className="d-flex align-items-center">
                            <i className="bi bi-exclamation-circle-fill text-danger me-2 fs-5"></i>
                            <div>Operation failed</div>
                        </div>
                    );
                }
            }
        });
    }, []);

    return (
        <NotificationContext.Provider value={{ 
            notifyConfirm, 
            notifyError, 
            notifyInform, 
            notifyWarning, 
            notifyLoading 
        }}>
            {children}
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                className="custom-toast-container"
            />
        </NotificationContext.Provider>
    );
}
